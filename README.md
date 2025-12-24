# ParkEase - Smart Parking Solutions

A modern, mobile-first parking booking application built with React, TypeScript, and Tailwind CSS.

## Features

- **Smart Search**: Find parking spots by location, time, and vehicle type
- **Real-time Booking**: Book parking slots with instant confirmation
- **QR Code Access**: Seamless check-in/check-out with QR codes
- **Payment Integration**: Secure payment processing
- **Booking Management**: Track active bookings and history
- **Vehicle Management**: Support for multiple vehicles
- **Location Services**: GPS-based parking spot discovery

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router DOM
- **State Management**: React Context API with localStorage persistence
- **Forms**: React Hook Form with Zod validation
- **Notifications**: Sonner toast library

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd parkease-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── ui/             # shadcn/ui components
├── context/            # React Context providers
├── data/               # Mock data and types
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Application pages/routes
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles and design system
```

## Design System

ParkEase uses a custom design system with:
- **Primary Color**: Deep Teal (#1B9A8E)
- **Accent Color**: Coral (#FF6B47)
- **Typography**: Outfit font family
- **Custom gradients and shadows**
- **Mobile-first responsive design**

## Features Overview

### Authentication Flow
- Mobile number login with OTP verification
- Vehicle registration requirement
- Location permission handling

### Booking Flow
1. Search for parking spots by location and time
2. View available lots with details and amenities
3. Select vehicle and confirm booking
4. Process payment
5. Receive QR code for access
6. Check-in and check-out management

### User Management
- Profile management
- Multiple vehicle support
- Booking history
- Receipt generation

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please contact the development team.