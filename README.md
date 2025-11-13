# Queue Management System - Frontend

A modern React-based frontend application for managing patient queues in a healthcare or service facility. This application provides an intuitive interface for staff to manage queues and a public display for patients.

## 📋 Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Available Scripts](#available-scripts)
- [Building for Production](#building-for-production)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- **User Authentication**: Secure login with token-based authentication
- **Staff Dashboard**: 
  - View current queue with real-time updates (5-second refresh)
  - Add new patients to the queue
  - Call patients for consultation
  - Complete consultations
  - Update patient priority (normal, urgent, emergency)
  - Remove patients from queue
  - View queue statistics (waiting count, in consultation, completed today)
- **Public Display**: Real-time queue display for public viewing (no authentication required)
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Auto-refresh**: Queue data automatically refreshes every 5 seconds
- **Comprehensive Testing**: Unit tests with React Testing Library

## 📦 Requirements

- Node.js >= 14.x
- npm >= 6.x (or yarn)
- Backend API running on `http://localhost:8000` (or configured API URL)

## 🚀 Installation

### 1. Navigate to frontend directory

```bash
cd /Users/sympliceintwari/Downloads/efishe_assessment/frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables (optional)

Create a `.env` file in the frontend root directory:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

If not set, the app defaults to `/queue/api` (relative path).

## ⚙️ Configuration

### API Base URL

The application connects to the backend API. Configure the API URL in one of these ways:

1. **Environment Variable** (Recommended for development):
   ```env
   REACT_APP_API_URL=http://localhost:8000/api
   ```

2. **Default**: If not configured, uses relative path `/queue/api`

3. **Production**: Set the environment variable in your deployment platform

### Homepage Configuration

The app is configured with `homepage: "/queue"` in `package.json`, which means:
- The app is served at `http://localhost:3000/queue` in development
- Routes are prefixed with `/queue` (e.g., `/queue/login`, `/queue/display`)

## 🏃 Running the Application

### Development Mode

```bash
npm start
```

This will:
- Start the development server
- Open [http://localhost:3000/queue](http://localhost:3000/queue) in your browser
- Enable hot-reloading for instant updates

**Note**: Make sure your backend API is running on `http://localhost:8000` before starting the frontend.

### Access Points

- **Login Page**: http://localhost:3000/queue/login
- **Staff Dashboard**: http://localhost:3000/queue/ (requires authentication)
- **Public Display**: http://localhost:3000/queue/display (no authentication required)

## 🧪 Testing

### Run All Tests

```bash
npm test
```

This launches the test runner in interactive watch mode. Press `a` to run all tests.

### Run Tests Once

```bash
CI=true npm test
```

### Test Coverage

The project includes comprehensive tests for:
- **App Component**: Main app routing and authentication flow
- **Login Component**: Login form validation and submission
- **StaffDashboard Component**: Queue management operations
- **PublicDisplay Component**: Public queue display
- **ProtectedRoute Component**: Route protection logic

### Test Files

- `src/App.test.js` - App component tests
- `src/components/__tests__/Login.test.jsx` - Login component tests
- `src/components/__tests__/StaffDashboard.test.jsx` - Dashboard tests
- `src/components/__tests__/PublicDisplay.test.jsx` - Public display tests
- `src/components/__tests__/ProtectedRoute.test.jsx` - Route protection tests

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html              # HTML template
│   └── manifest.json            # PWA manifest
├── src/
│   ├── components/
│   │   ├── __tests__/          # Component tests
│   │   │   ├── Login.test.jsx
│   │   │   ├── StaffDashboard.test.jsx
│   │   │   ├── PublicDisplay.test.jsx
│   │   │   └── ProtectedRoute.test.jsx
│   │   ├── Login.jsx           # Login page component
│   │   ├── StaffDashboard.jsx  # Main dashboard for staff
│   │   ├── PublicDisplay.jsx   # Public queue display
│   │   └── ProtectedRoute.jsx  # Route protection wrapper
│   ├── services/
│   │   └── api.js              # API service layer (axios)
│   ├── App.js                  # Main app component with routing
│   ├── App.css                 # App styles
│   ├── App.test.js             # App component tests
│   ├── index.js                # Application entry point
│   ├── index.css               # Global styles
│   └── setupTests.js           # Test configuration
├── package.json                # Dependencies and scripts
├── tailwind.config.js         # Tailwind CSS configuration
└── postcss.config.js           # PostCSS configuration
```

## 🛠 Technologies Used

- **React 19.2** - UI library
- **React Router DOM 6.23** - Client-side routing
- **Axios 1.6** - HTTP client for API calls
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **React Testing Library** - Component testing utilities
- **Create React App** - Build tooling and development server

## 📝 Available Scripts

### `npm start`

Runs the app in development mode at [http://localhost:3000/queue](http://localhost:3000/queue).

- Hot-reloading enabled
- Source maps for debugging
- Error overlay in browser

### `npm test`

Launches the test runner in interactive watch mode.

- Watches for file changes
- Re-runs tests automatically
- Press `a` to run all tests
- Press `f` to run only failed tests
- Press `q` to quit watch mode

### `npm run build`

Builds the app for production to the `build` folder.

- Optimized production build
- Minified JavaScript and CSS
- Hashed filenames for cache busting
- Ready for deployment

### `npm run eject`

**⚠️ Warning: This is a one-way operation!**

Ejects from Create React App to get full control over configuration. You cannot undo this operation.

## 🏗 Building for Production

### Build the Application

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

### Serve the Production Build Locally

```bash
# Using serve package
npx serve -s build -l 3000

# Or using Python
cd build
python3 -m http.server 3000
```

### Deployment

The `build` folder contains static files that can be deployed to:

- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **CDN**: CloudFront, Cloudflare
- **Web Server**: Nginx, Apache (serve the `build` folder)

**Important**: Update `REACT_APP_API_URL` environment variable in your deployment platform to point to your production API.

## 🔐 Authentication Flow

1. User visits the app → Redirected to `/login` if not authenticated
2. User enters credentials → POST to `/api/login`
3. Token received → Stored in `localStorage` as `auth_token`
4. User data stored → Stored in `localStorage` as `user`
5. Protected routes accessible → Token included in API requests
6. Auto-logout → On 401 response, user is logged out automatically

## 🔄 API Integration

The application uses a centralized API service (`src/services/api.js`) that:

- **Automatic Token Injection**: Adds Bearer token to all authenticated requests
- **Error Handling**: Automatically handles 401 errors (unauthorized)
- **Base URL Configuration**: Configurable via environment variable
- **Request/Response Interceptors**: Handles authentication and errors

### API Endpoints Used

- `POST /api/login` - User authentication
- `POST /api/logout` - User logout
- `GET /api/user` - Get authenticated user
- `GET /api/queue/current` - Get current queue (staff)
- `GET /api/queue/display` - Get display data (public)
- `POST /api/queue/add` - Add patient to queue
- `PUT /api/queue/{id}/call` - Call patient
- `PUT /api/queue/{id}/complete` - Complete consultation
- `PUT /api/queue/{id}/priority` - Update priority
- `DELETE /api/queue/{id}` - Remove patient

## 🎨 Styling

The application uses **Tailwind CSS** for styling:

- Utility-first CSS framework
- Responsive design utilities
- Custom configuration in `tailwind.config.js`
- PostCSS for processing

### Customization

Edit `tailwind.config.js` to customize:
- Colors
- Fonts
- Spacing
- Breakpoints
- And more

## 🐛 Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# Set a different port
PORT=3001 npm start
```

### API Connection Issues

1. **Check Backend is Running**: Ensure backend is running on `http://localhost:8000`
2. **Check API URL**: Verify `REACT_APP_API_URL` in `.env` file
3. **Check CORS**: Ensure backend CORS allows requests from `http://localhost:3000`
4. **Check Browser Console**: Look for CORS or network errors

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf build
npm run build
```

### Tests Not Running

```bash
# Clear test cache
npm test -- --clearCache

# Run tests with verbose output
npm test -- --verbose
```

### Authentication Issues

- **Token Expired**: Logout and login again
- **Token Not Saved**: Check browser localStorage
- **401 Errors**: Verify token is being sent in Authorization header

### Routing Issues

The app uses `basename="/queue"` in React Router. Ensure:
- All routes are prefixed with `/queue`
- Production server is configured to serve from `/queue` path
- Or update `homepage` in `package.json` if deploying to root

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔗 Related Documentation

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [React Router Documentation](https://reactrouter.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [React Testing Library](https://testing-library.com/react)

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

---

**Built with React** - A JavaScript library for building user interfaces
