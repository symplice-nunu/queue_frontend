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

// Mock BrowserRouter to use MemoryRouter in tests
// This allows tests to work properly without browser history
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  const React = require('react');
  return {
    ...actual,
    BrowserRouter: ({ children, basename }) => {
      // In tests, we use MemoryRouter which doesn't need basename
      // Routes are defined as "/login", "/", etc. in App.js
      // When user is not authenticated, ProtectedRoute redirects to "/login"
      const MemoryRouter = actual.MemoryRouter;
      return React.createElement(MemoryRouter, { initialEntries: ['/login'], initialIndex: 0 }, children);
    },
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
