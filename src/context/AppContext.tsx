import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Vehicle, Booking, User, ParkingLot, mockParkingLots } from '@/data/mockData';
import { SupabaseService } from '@/services/supabase';
import { USE_SUPABASE } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AppState {
  // Auth state
  isAuthenticated: boolean;
  mobile: string;
  isOtpVerified: boolean;
  hasVehicle: boolean;
  locationGranted: boolean;
  supabaseUser: SupabaseUser | null;
  
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
  verifyOtp: (otp?: string) => Promise<void>;
  logout: () => void;
  setLocationGranted: (granted: boolean) => void;
  
  // Vehicle actions
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => Promise<void>;
  removeVehicle: (id: string) => void;
  
  // Booking actions
  setCurrentBookingLot: (lot: ParkingLot) => void;
  setCurrentBookingVehicle: (vehicle: Vehicle) => void;
  setCurrentBookingTime: (startTime: Date, endTime: Date) => void;
  confirmBooking: (booking: Booking) => Promise<void>;
  clearCurrentBooking: () => void;
  
  // Active booking actions
  setActiveBooking: (booking: Booking) => void;
  checkIn: (bookingId: string) => Promise<void>;
  checkOut: (bookingId: string) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
  
  // Add booking to history
  addToHistory: (booking: Booking) => void;
  
  // Load data from Supabase
  loadUserData: () => Promise<void>;
}

const defaultState: AppState = {
  isAuthenticated: false,
  mobile: '',
  isOtpVerified: false,
  hasVehicle: false,
  locationGranted: false,
  supabaseUser: null,
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

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [state]);

  // Initialize auth state from Supabase
  useEffect(() => {
    const initializeAuth = async () => {
      if (USE_SUPABASE) {
        const user = await SupabaseService.getCurrentUser();
        if (user) {
          setState(prev => ({
            ...prev,
            supabaseUser: user,
            isAuthenticated: true,
            isOtpVerified: true,
            mobile: user.user_metadata?.phone || prev.mobile
          }));
          
          // Try to load user data, but don't fail if tables don't exist
          await loadUserData();
        }
      }
    };
    
    initializeAuth();
  }, []);

  const loadUserData = async () => {
    if (!USE_SUPABASE) {
      console.log('Supabase disabled, using mock data');
      return;
    }
    
    try {
      const user = await SupabaseService.getCurrentUser();
      if (user) {
        // Try to load data, but don't fail if tables don't exist
        try {
          const vehicles = await SupabaseService.getUserVehicles(user.id);
          const bookings = await SupabaseService.getUserBookings(user.id);
          
          setState(prev => ({
            ...prev,
            vehicles: vehicles.map(v => ({
              id: v.id,
              type: v.type,
              number: v.vehicle_number,
              nickname: ''
            })),
            bookings: bookings.map(b => ({
              id: b.id,
              lotId: b.lot_id,
              lot: mockParkingLots.find(l => l.id === b.lot_id)!,
              vehicleId: b.user_id,
              vehicle: { id: b.user_id, type: 'car', number: b.vehicle_number },
              startTime: new Date(b.start_time),
              endTime: new Date(b.end_time),
              status: b.status as any,
              amount: b.amount_paid,
              qrToken: b.id,
              refundAmount: b.refund_amount || undefined,
              refundStatus: b.refund_status as any,
              cancelledAt: b.cancelled_at ? new Date(b.cancelled_at) : undefined,
              checkedInAt: b.checked_in_at ? new Date(b.checked_in_at) : undefined
            })),
            hasVehicle: vehicles.length > 0
          }));
        } catch (dbError) {
          console.warn('Database tables not ready, using mock data:', dbError);
          // Continue with empty data - user can add vehicles manually
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const setMobile = (mobile: string) => {
    setState(prev => ({ ...prev, mobile }));
  };

  const verifyOtp = async (otp?: string) => {
    if (USE_SUPABASE) {
      // Supabase auth is handled in OtpPage
      setState(prev => ({
        ...prev,
        isOtpVerified: true,
        isAuthenticated: prev.vehicles.length > 0 || prev.hasVehicle,
        user: {
          mobile: prev.mobile,
          vehicles: prev.vehicles,
          bookings: prev.bookings,
        },
      }));
    } else {
      // Mock implementation
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
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(defaultState);
  };

  const setLocationGranted = (granted: boolean) => {
    setState(prev => ({ ...prev, locationGranted: granted }));
  };

  const addVehicle = async (vehicle: Omit<Vehicle, 'id'>) => {
    if (USE_SUPABASE) {
      try {
        const user = await SupabaseService.getCurrentUser();
        if (user) {
          // Update user phone number if provided
          if (state.mobile && state.mobile !== (user.phone || user.user_metadata?.phone)) {
            await SupabaseService.updateUserPhone(user.id, state.mobile);
          }
          
          const { data, error } = await SupabaseService.addVehicle(
            user.id,
            vehicle.number,
            vehicle.type,
            vehicle.nickname
          );
          
          if (error) throw error;
          
          const newVehicle: Vehicle = {
            id: data.id,
            type: data.type,
            number: data.vehicle_number,
            nickname: data.nickname || undefined,
          };
          
          setState(prev => ({
            ...prev,
            vehicles: [...prev.vehicles, newVehicle],
            hasVehicle: true,
            isAuthenticated: prev.isOtpVerified,
          }));
          return;
        }
      } catch (error) {
        console.error('Failed to add vehicle to Supabase:', error);
        // Log the specific error details
        if (error.message) {
          console.error('Error message:', error.message);
        }
        if (error.details) {
          console.error('Error details:', error.details);
        }
        throw new Error(error.message || 'Database error occurred');
      }
    }
    
    // Fallback to local storage
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

  const confirmBooking = async (booking: Booking) => {
    if (USE_SUPABASE) {
      try {
        const user = await SupabaseService.getCurrentUser();
        if (user) {
          console.log('Creating booking with lot_id:', booking.lotId);
          const { data, error } = await SupabaseService.createBooking({
            user_id: user.id,
            lot_id: booking.lotId,
            slot_label: booking.slot || 'A1',
            vehicle_number: booking.vehicle.number,
            start_time: booking.startTime.toISOString(),
            end_time: booking.endTime.toISOString(),
            amount_paid: booking.amount,
            status: 'PAID'
          });
          
          if (error) throw error;
          
          const supabaseBooking: Booking = {
            ...booking,
            id: data.id,
            status: 'PAID'
          };
          
          setState(prev => ({
            ...prev,
            bookings: [...prev.bookings, supabaseBooking],
            activeBooking: supabaseBooking,
            currentBooking: {
              lot: null,
              vehicle: null,
              startTime: null,
              endTime: null,
            },
          }));
          return;
        }
      } catch (error) {
        console.error('Failed to create booking in Supabase:', error);
        // Log the specific error details
        if (error.message) {
          console.error('Error message:', error.message);
        }
        if (error.details) {
          console.error('Error details:', error.details);
        }
        if (error.code) {
          console.error('Error code:', error.code);
        }
        throw new Error(error.message || 'Failed to create booking');
      }
    }
    
    // Fallback to local storage
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

  const checkIn = async (bookingId: string) => {
    if (USE_SUPABASE) {
      try {
        const { error } = await SupabaseService.updateBookingStatus(
          bookingId, 
          'CHECKED_IN',
          { checked_in_at: new Date().toISOString() }
        );
        if (error) throw error;
      } catch (error) {
        console.error('Failed to update check-in in Supabase:', error);
        throw error;
      }
    }
    
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

  const checkOut = async (bookingId: string) => {
    console.log('Starting checkout for booking:', bookingId);
    
    if (USE_SUPABASE) {
      try {
        console.log('Updating booking status to COMPLETED in Supabase');
        const { error } = await SupabaseService.updateBookingStatus(
          bookingId, 
          'COMPLETED',
          { checked_out_at: new Date().toISOString() }
        );
        if (error) {
          console.error('Supabase update error:', error);
          throw error;
        }
        console.log('Supabase update successful');
      } catch (error) {
        console.error('Failed to update check-out in Supabase:', error);
        throw error;
      }
    }
    
    console.log('Updating local state');
    setState(prev => {
      const booking = prev.bookings.find(b => b.id === bookingId);
      if (!booking) {
        console.error('Booking not found in local state:', bookingId);
        return prev;
      }
      
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
      
      console.log('Updated booking:', updatedBooking);
      
      return {
        ...prev,
        bookings: prev.bookings.map(b => b.id === bookingId ? updatedBooking : b),
        activeBooking: null,
      };
    });
    
    console.log('Checkout completed successfully');
  };

  const cancelBooking = async (bookingId: string) => {
    if (USE_SUPABASE) {
      try {
        const booking = state.bookings.find(b => b.id === bookingId);
        if (!booking || booking.status === 'CHECKED_IN') return;
        
        // Calculate refund amount based on time before start
        const minutesToStart = (booking.startTime.getTime() - Date.now()) / (1000 * 60);
        let refundPercent = 0;
        
        if (minutesToStart > 60) refundPercent = 100;
        else if (minutesToStart > 15) refundPercent = 50;
        else refundPercent = 0;
        
        const refundAmount = Math.round(booking.amount * (refundPercent / 100));
        
        // Update booking in Supabase
        const { error } = await SupabaseService.cancelBooking(bookingId, refundAmount);
        if (error) throw error;
        
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
        
        setState(prev => ({
          ...prev,
          bookings: prev.bookings.map(b => b.id === bookingId ? updatedBooking : b),
          activeBooking: prev.activeBooking?.id === bookingId ? null : prev.activeBooking,
        }));
        return;
      } catch (error) {
        console.error('Failed to cancel booking in Supabase:', error);
        throw error;
      }
    }
    
    // Fallback to local storage
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
        loadUserData,
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
