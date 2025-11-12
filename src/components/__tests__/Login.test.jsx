import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../Login';
import { authAPI, queueAPI } from '../../services/api';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

jest.mock('../../services/api', () => {
  const authAPI = {
    login: jest.fn(),
    logout: jest.fn(),
    getUser: jest.fn(),
  };

  const queueAPI = {
    getCurrent: jest.fn(),
    getDisplay: jest.fn(),
    addPatient: jest.fn(),
    callPatient: jest.fn(),
    completePatient: jest.fn(),
    updatePriority: jest.fn(),
    removePatient: jest.fn(),
  };

  return {
    __esModule: true,
    default: {
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    },
    authAPI,
    queueAPI,
  };
});

describe('Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockReset();
    localStorage.clear();
  });

  test('submits credentials and stores auth data on success', async () => {
    authAPI.login.mockResolvedValue({
      data: {
        token: 'token-123',
        user: { name: 'Jane Doe', email: 'jane@example.com' },
      },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'jane@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'secret' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(authAPI.login).toHaveBeenCalledWith({
        email: 'jane@example.com',
        password: 'secret',
      });
    });

    expect(localStorage.getItem('auth_token')).toBe('token-123');
    expect(JSON.parse(localStorage.getItem('user') || '{}')).toEqual({
      name: 'Jane Doe',
      email: 'jane@example.com',
    });
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('shows error message when login fails', async () => {
    authAPI.login.mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'jane@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrong' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() =>
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    );

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

