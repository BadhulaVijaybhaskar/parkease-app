import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Vehicle, Booking, User, ParkingLot } from '@/data/mockData';

interface AppState {
  // Auth state
  isAuthenticated: boolean;
  mobile: string;
  isOtpVerified: boolean;
  hasVehicle: boolean;
  locationGranted: boolean;
  
  // User data
  user: User | null;
  vehicles: Vehicle[];
  bookings: Booking[];
  
  // Current booking flow
  currentBooking: {
    lot: ParkingLot | null;
    vehicle: Vehicle | null;
    startTime: Date | null;
    endTime: Date | null;
  };
  
  // Active booking
  activeBooking: Booking | null;
}

interface AppContextType extends AppState {
  // Auth actions
  setMobile: (mobile: string) => void;
  verifyOtp: () => void;
  logout: () => void;
  setLocationGranted: (granted: boolean) => void;
  
  // Vehicle actions
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  removeVehicle: (id: string) => void;
  
  // Booking actions
  setCurrentBookingLot: (lot: ParkingLot) => void;
  setCurrentBookingVehicle: (vehicle: Vehicle) => void;
  setCurrentBookingTime: (startTime: Date, endTime: Date) => void;
  confirmBooking: (booking: Booking) => void;
  clearCurrentBooking: () => void;
  
  // Active booking actions
  setActiveBooking: (booking: Booking) => void;
  checkIn: (bookingId: string) => void;
  checkOut: (bookingId: string) => void;
  cancelBooking: (bookingId: string) => void;
  
  // Add booking to history
  addToHistory: (booking: Booking) => void;
}

const defaultState: AppState = {
  isAuthenticated: false,
  mobile: '',
  isOtpVerified: false,
  hasVehicle: false,
  locationGranted: false,
  user: null,
  vehicles: [],
  bookings: [],
  currentBooking: {
    lot: null,
    vehicle: null,
    startTime: null,
    endTime: null,
  },
  activeBooking: null,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'parkease_state';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Restore dates
        if (parsed.currentBooking?.startTime) {
          parsed.currentBooking.startTime = new Date(parsed.currentBooking.startTime);
        }
        if (parsed.currentBooking?.endTime) {
          parsed.currentBooking.endTime = new Date(parsed.currentBooking.endTime);
        }
        if (parsed.activeBooking) {
          parsed.activeBooking.startTime = new Date(parsed.activeBooking.startTime);
          parsed.activeBooking.endTime = new Date(parsed.activeBooking.endTime);
          if (parsed.activeBooking.checkedInAt) {
            parsed.activeBooking.checkedInAt = new Date(parsed.activeBooking.checkedInAt);
          }
        }
        if (parsed.bookings) {
          parsed.bookings = parsed.bookings.map((b: any) => ({
            ...b,
            startTime: new Date(b.startTime),
            endTime: new Date(b.endTime),
            checkedInAt: b.checkedInAt ? new Date(b.checkedInAt) : undefined,
            checkedOutAt: b.checkedOutAt ? new Date(b.checkedOutAt) : undefined,
          }));
        }
        return { ...defaultState, ...parsed };
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    }
    return defaultState;
  });

  // Persist state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [state]);

  const setMobile = (mobile: string) => {
    setState(prev => ({ ...prev, mobile }));
  };

  const verifyOtp = () => {
    setState(prev => ({
      ...prev,
      isOtpVerified: true,
      isAuthenticated: prev.vehicles.length > 0,
      user: {
        mobile: prev.mobile,
        vehicles: prev.vehicles,
        bookings: prev.bookings,
      },
    }));
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(defaultState);
  };

  const setLocationGranted = (granted: boolean) => {
    setState(prev => ({ ...prev, locationGranted: granted }));
  };

  const addVehicle = (vehicle: Omit<Vehicle, 'id'>) => {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: `V${Date.now()}`,
    };
    setState(prev => ({
      ...prev,
      vehicles: [...prev.vehicles, newVehicle],
      hasVehicle: true,
      isAuthenticated: prev.isOtpVerified,
    }));
  };

  const removeVehicle = (id: string) => {
    setState(prev => {
      const newVehicles = prev.vehicles.filter(v => v.id !== id);
      return {
        ...prev,
        vehicles: newVehicles,
        hasVehicle: newVehicles.length > 0,
      };
    });
  };

  const setCurrentBookingLot = (lot: ParkingLot) => {
    setState(prev => ({
      ...prev,
      currentBooking: { ...prev.currentBooking, lot },
    }));
  };

  const setCurrentBookingVehicle = (vehicle: Vehicle) => {
    setState(prev => ({
      ...prev,
      currentBooking: { ...prev.currentBooking, vehicle },
    }));
  };

  const setCurrentBookingTime = (startTime: Date, endTime: Date) => {
    setState(prev => ({
      ...prev,
      currentBooking: { ...prev.currentBooking, startTime, endTime },
    }));
  };

  const confirmBooking = (booking: Booking) => {
    setState(prev => ({
      ...prev,
      bookings: [...prev.bookings, booking],
      activeBooking: booking,
      currentBooking: {
        lot: null,
        vehicle: null,
        startTime: null,
        endTime: null,
      },
    }));
  };

  const clearCurrentBooking = () => {
    setState(prev => ({
      ...prev,
      currentBooking: {
        lot: null,
        vehicle: null,
        startTime: null,
        endTime: null,
      },
    }));
  };

  const setActiveBooking = (booking: Booking) => {
    setState(prev => ({ ...prev, activeBooking: booking }));
  };

  const checkIn = (bookingId: string) => {
    setState(prev => {
      const booking = prev.bookings.find(b => b.id === bookingId);
      if (!booking) return prev;
      
      const updatedBooking: Booking = {
        ...booking,
        status: 'CHECKED_IN',
        checkedInAt: new Date(),
      };
      
      return {
        ...prev,
        bookings: prev.bookings.map(b => b.id === bookingId ? updatedBooking : b),
        activeBooking: updatedBooking,
      };
    });
  };

  const checkOut = (bookingId: string) => {
    setState(prev => {
      const booking = prev.bookings.find(b => b.id === bookingId);
      if (!booking) return prev;
      
      const now = new Date();
      let overstayAmount = 0;
      
      if (now > booking.endTime) {
        const overstayHours = Math.ceil((now.getTime() - booking.endTime.getTime()) / (1000 * 60 * 60));
        overstayAmount = overstayHours * booking.lot.pricePerHour * 1.5; // 1.5x for overstay
      }
      
      const updatedBooking: Booking = {
        ...booking,
        status: 'COMPLETED',
        checkedOutAt: now,
        overstayAmount,
      };
      
      return {
        ...prev,
        bookings: prev.bookings.map(b => b.id === bookingId ? updatedBooking : b),
        activeBooking: null,
      };
    });
  };

  const cancelBooking = (bookingId: string) => {
    setState(prev => {
      const booking = prev.bookings.find(b => b.id === bookingId);
      if (!booking || booking.status === 'CHECKED_IN') return prev;
      
      // Calculate refund amount based on time before start
      const minutesToStart = (booking.startTime.getTime() - Date.now()) / (1000 * 60);
      let refundPercent = 0;
      
      if (minutesToStart > 60) refundPercent = 100;
      else if (minutesToStart > 15) refundPercent = 50;
      else refundPercent = 0;
      
      const refundAmount = Math.round(booking.amount * (refundPercent / 100));
      
      const updatedBooking: Booking = {
        ...booking,
        status: 'CANCELLED',
        cancelledAt: new Date(),
        refundStatus: 'INITIATED',
        refundAmount,
      };
      
      // Simulate refund completion after 3 seconds
      setTimeout(() => {
        setState(current => ({
          ...current,
          bookings: current.bookings.map(b => 
            b.id === bookingId 
              ? { ...b, refundStatus: 'COMPLETED' as const }
              : b
          ),
        }));
      }, 3000);
      
      return {
        ...prev,
        bookings: prev.bookings.map(b => b.id === bookingId ? updatedBooking : b),
        activeBooking: prev.activeBooking?.id === bookingId ? null : prev.activeBooking,
      };
    });
  };

  const addToHistory = (booking: Booking) => {
    setState(prev => ({
      ...prev,
      bookings: [...prev.bookings, booking],
    }));
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        setMobile,
        verifyOtp,
        logout,
        setLocationGranted,
        addVehicle,
        removeVehicle,
        setCurrentBookingLot,
        setCurrentBookingVehicle,
        setCurrentBookingTime,
        confirmBooking,
        clearCurrentBooking,
        setActiveBooking,
        checkIn,
        checkOut,
        cancelBooking,
        addToHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
