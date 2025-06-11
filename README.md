# Multi-Streaming Platform Frontend

A React-based frontend application for multi-platform streaming with authentication and dashboard features.

## Features

- **Authentication System**: Complete user registration and login with real backend integration
- **Theme System**: Light and dark mode toggle with system preference detection
- **Dashboard**: Comprehensive streaming dashboard with:
  - Live streaming controls (Start/Stop)
  - Real-time viewer statistics
  - Platform connection buttons (YouTube, Twitch, Facebook, Instagram, TikTok, Discord)
  - RTMP key management with secure popups
  - Platform status monitoring
  - Recent streams history
  - User-friendly interface with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd multi-streaming-platform-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in terminal)

## Usage

### Registration

- Navigate to `/register` or click "Sign up here" from the login page
- Enter your email address and password (minimum 6 characters)
- Confirm your password
- Click "Create account" to register and automatically login

### Login

- Navigate to `/login` or click "Sign in here" from the register page
- Enter your registered email and password
- Click "Sign in" to access the dashboard

### Dashboard

- View live streaming statistics
- Connect to multiple streaming platforms (YouTube, Twitch, Facebook, Instagram, TikTok, Discord)
- Add RTMP keys through secure popup modals
- Start/stop streaming sessions
- Monitor platform connection status
- View recent streaming history
- Toggle between light and dark themes
- Logout when finished

### Platform Connection

- Click on any platform button to open the RTMP key modal
- Enter your platform-specific stream key securely
- Keys are masked by default with show/hide toggle
- Copy functionality for easy key management
- Platform-specific setup instructions and help links
- Visual connection status indicators

### Theme Toggle

- Click the sun/moon icon in the top-right corner of any page
- Automatically detects your system preference on first visit
- Remembers your theme choice in localStorage
- Smooth transitions between light and dark modes

## Technology Stack

- **React 19** - Frontend framework
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Styling and UI components
- **Lucide React** - Icons
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client
- **Vite** - Build tool and development server

## Project Structure

```
src/
├── components/
│   ├── Login.jsx          # Login page component
│   ├── Register.jsx       # Registration page component
│   ├── Dashboard.jsx      # Main dashboard component
│   ├── ThemeToggle.jsx    # Theme toggle button component
│   ├── Modal.jsx          # Reusable modal component
│   ├── PlatformButton.jsx # Individual platform button
│   ├── PlatformButtons.jsx # Platform buttons container
│   └── RTMPKeyModal.jsx   # RTMP key input modal
├── contexts/
│   └── ThemeContext.jsx   # Theme context provider
├── hooks/
│   └── useTheme.js        # Theme management hook
├── services/
│   └── authService.js     # Authentication API service
├── utils/
│   ├── auth.js           # Authentication utilities
│   └── theme.js          # Theme utilities
├── App.jsx               # Main app with routing
├── main.jsx             # Application entry point
└── index.css            # Global styles with theme variables
```

## Backend Integration

This frontend integrates with a Node.js/Express backend API:

- **Backend URL**: `https://multi-streaming-platform-backend.vercel.app`
- **Authentication**: Real user registration and login
- **API Keys**: YouTube, Facebook, and Twitch streaming keys management
- **Cookies**: HTTP-only cookies for session management

## Theme System

The application includes a comprehensive dark/light theme system:

### Features

- **Automatic Detection**: Detects system preference on first visit
- **Manual Toggle**: Sun/moon button to switch themes manually
- **Persistence**: Remembers user preference in localStorage
- **Smooth Transitions**: CSS transitions for seamless theme switching
- **Comprehensive Coverage**: All components support both themes

### Implementation

- **CSS Variables**: Uses CSS custom properties for theme colors
- **Tailwind Integration**: Leverages Tailwind's dark mode support
- **React Context**: Theme state managed via React Context API
- **System Integration**: Listens to system theme changes

## Platform Integration

The application supports multiple streaming platforms with a comprehensive UI system:

### Supported Platforms

- **YouTube** - Full RTMP streaming support
- **Twitch** - Live streaming integration
- **Facebook** - Social media streaming
- **Instagram** - Live broadcast support
- **TikTok** - Short-form live streaming
- **Discord** - Community streaming

### Features

- **Visual Platform Buttons**: Branded buttons with platform-specific colors and icons
- **Secure Key Management**: RTMP keys are masked and stored securely
- **Connection Status**: Real-time visual indicators for connected platforms
- **Setup Guidance**: Platform-specific instructions and help links
- **Responsive Design**: Works seamlessly on desktop and mobile devices
