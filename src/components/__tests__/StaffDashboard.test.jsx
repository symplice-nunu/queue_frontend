import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import StaffDashboard from '../StaffDashboard';
import { queueAPI } from '../../services/api';

jest.mock('../../services/api', () => {
  const queueAPI = {
    getCurrent: jest.fn(),
    getDisplay: jest.fn(),
    addPatient: jest.fn(),
    callPatient: jest.fn(),
    completePatient: jest.fn(),
    updatePriority: jest.fn(),
    removePatient: jest.fn(),
  };

  const authAPI = {
    login: jest.fn(),
    logout: jest.fn(),
    getUser: jest.fn(),
  };

  return {
    __esModule: true,
    default: {
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    },
    queueAPI,
    authAPI,
  };
});

const originalConfirm = window.confirm;

const sampleQueueResponse = {
  data: {
    waiting_count: 1,
    in_consultation: 1,
    completed_today: 2,
    current_number: 5,
    queue: [
      {
        id: 1,
        queue_number: 1,
        patient_name: 'John Doe',
        patient_age: 35,
        complaint: 'Headache',
        priority: 'normal',
        status: 'waiting',
      },
    ],
  },
};

describe('StaffDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queueAPI.getCurrent.mockResolvedValue(sampleQueueResponse);
    queueAPI.addPatient.mockResolvedValue({ data: {} });
    queueAPI.callPatient.mockResolvedValue({ data: {} });
    queueAPI.updatePriority.mockResolvedValue({ data: {} });
    queueAPI.removePatient.mockResolvedValue({ data: {} });
    window.confirm = jest.fn(() => true);
  });

  afterAll(() => {
    window.confirm = originalConfirm;
  });

  test('loads and displays queue statistics and entries', async () => {
    render(<StaffDashboard />);

    await screen.findByText('John Doe');

    expect(
      screen.getByText(/queue management dashboard/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/headache/i)).toBeInTheDocument();
    expect(screen.getAllByText(/waiting/i)[0]).toBeInTheDocument();
  });

  test('submits new patient form and refreshes queue', async () => {
    render(<StaffDashboard />);

    await screen.findByText('John Doe');

    fireEvent.click(
      screen.getByRole('button', { name: /\+ add patient to queue/i })
    );

    const formContainer = screen.getByText(/add new patient/i).closest('div');
    const form = formContainer ? formContainer.querySelector('form') : null;
    if (!form) {
      throw new Error('Add patient form not found');
    }

    const formWithin = within(form);
    const [nameInput, phoneInput, complaintInput] = formWithin.getAllByRole('textbox');
    const ageInput = formWithin.getByRole('spinbutton');
    const prioritySelect = formWithin.getByRole('combobox');

    fireEvent.change(nameInput, { target: { value: 'Jane Smith' } });
    fireEvent.change(ageInput, { target: { value: '28' } });
    fireEvent.change(phoneInput, { target: { value: '555-1234' } });
    fireEvent.change(prioritySelect, { target: { value: 'urgent' } });
    fireEvent.change(complaintInput, { target: { value: 'Fever' } });

    fireEvent.click(
      formWithin.getByRole('button', { name: /add to queue/i })
    );

    await waitFor(() =>
      expect(queueAPI.addPatient).toHaveBeenCalledWith({
        name: 'Jane Smith',
        age: '28',
        phone: '555-1234',
        complaint: 'Fever',
        priority: 'urgent',
      })
    );

    expect(queueAPI.getCurrent).toHaveBeenCalledTimes(2);
  });

  test('handles priority change and remove actions', async () => {
    render(<StaffDashboard />);

    const row = await screen.findByText('John Doe');
    const rowElement = row.closest('tr');
    if (!rowElement) {
      throw new Error('Queue row not found');
    }

    const prioritySelect = within(rowElement).getByRole(
      'combobox'
    );
    fireEvent.change(prioritySelect, { target: { value: 'urgent' } });

    await waitFor(() =>
      expect(queueAPI.updatePriority).toHaveBeenCalledWith(1, 'urgent')
    );

    fireEvent.click(screen.getByRole('button', { name: /call/i }));

    await waitFor(() =>
      expect(queueAPI.callPatient).toHaveBeenCalledWith(1)
    );

    fireEvent.click(screen.getByRole('button', { name: /remove/i }));

    await waitFor(() =>
      expect(queueAPI.removePatient).toHaveBeenCalledWith(1)
    );
    expect(window.confirm).toHaveBeenCalled();
  });
});

