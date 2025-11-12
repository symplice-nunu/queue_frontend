import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./services/api', () => {
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

beforeEach(() => {
  localStorage.clear();
});

test('renders login page when user is not authenticated', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /queue management/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
});
