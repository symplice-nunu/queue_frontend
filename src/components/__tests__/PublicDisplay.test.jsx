import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PublicDisplay from '../PublicDisplay';
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

describe('PublicDisplay', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetches and renders display data', async () => {
    const mockResponse = {
      current_number: 15,
      next_numbers: [
        { number: 16, priority: 'normal' },
        { number: 17, priority: 'urgent' },
      ],
      waiting_count: 5,
      updated_at: new Date('2025-11-12T12:00:00Z').toISOString(),
    };

    queueAPI.getDisplay.mockResolvedValue({ data: mockResponse });

    render(<PublicDisplay />);

    await waitFor(() => expect(queueAPI.getDisplay).toHaveBeenCalledTimes(1));
    const currentNumberNode = await screen.findByText(
      (content, node) => node.textContent === '15'
    );
    expect(currentNumberNode).toBeInTheDocument();
    const sixteenNodes = screen.getAllByText(
      (content, node) => node.textContent === '16'
    );
    const seventeenNodes = screen.getAllByText(
      (content, node) => node.textContent === '17'
    );
    expect(sixteenNodes.length).toBeGreaterThan(0);
    expect(seventeenNodes.length).toBeGreaterThan(0);
    expect(
      screen.getByText(/5 (person|people) waiting/i)
    ).toBeInTheDocument();
  });

  test('falls back to placeholders when fetch fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    queueAPI.getDisplay.mockRejectedValue(new Error('Network error'));

    render(<PublicDisplay />);

    await waitFor(() => expect(queueAPI.getDisplay).toHaveBeenCalledTimes(1));
    expect(screen.getByText('---')).toBeInTheDocument();

    console.error.mockRestore();
  });
});

