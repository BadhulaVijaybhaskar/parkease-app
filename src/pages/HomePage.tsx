import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Clock, Car, User, ChevronRight, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { format } from 'date-fns';
import { useEffect } from 'react';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, hasVehicle, bookings, activeBooking, vehicles } = useApp();

  // Handle redirects in useEffect
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    if (!hasVehicle) {
      navigate('/add-vehicle');
      return;
    }
  }, [isAuthenticated, hasVehicle, navigate]);

  const recentBookings = bookings
    .filter(b => b.status === 'COMPLETED')
    .slice(-3)
    .reverse();

  return (
    <div className="min-h-screen bg-background page-transition">
      {/* Header */}
      <div className="gradient-hero p-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-muted-foreground text-sm">Good day!</p>
            <h1 className="text-2xl font-bold text-foreground">Find Parking</h1>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center shadow-glow"
          >
            <User className="w-6 h-6 text-primary-foreground" />
          </button>
        </div>

        {/* Search Bar */}
        <button
          onClick={() => navigate('/search')}
          className="w-full flex items-center gap-3 p-4 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Search className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-foreground font-medium">Where do you want to park?</p>
            <p className="text-sm text-muted-foreground">Search by location or landmark</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/search')}
            className="p-4 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <p className="font-semibold text-foreground">Near Me</p>
            <p className="text-sm text-muted-foreground">Find spots nearby</p>
          </button>
          <button
            onClick={() => navigate('/booking/history')}
            className="p-4 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <p className="font-semibold text-foreground">History</p>
            <p className="text-sm text-muted-foreground">Past bookings</p>
          </button>
        </div>

        {/* Active Booking */}
        {activeBooking && activeBooking.status !== 'COMPLETED' && activeBooking.status !== 'CANCELLED' && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">Active Booking</h2>
            <button
              onClick={() => navigate('/booking/active')}
              className="w-full p-4 bg-primary/5 rounded-2xl border-2 border-primary/30 hover:border-primary transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-foreground">{activeBooking.lot.name}</p>
                  <p className="text-sm text-muted-foreground">{activeBooking.lot.address}</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-success/20 text-success text-sm font-medium">
                  {activeBooking.status === 'CHECKED_IN' ? 'Parked' : 'Upcoming'}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{format(activeBooking.startTime, 'hh:mm a')}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Car className="w-4 h-4" />
                  <span>{activeBooking.vehicle.number}</span>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* My Vehicles */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">My Vehicles</h2>
            <button
              onClick={() => navigate('/profile')}
              className="text-sm text-primary font-medium hover:underline"
            >
              Manage
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="flex-shrink-0 p-3 bg-card rounded-xl border border-border min-w-[140px]"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Car className="w-4 h-4 text-primary" />
                </div>
                <p className="font-mono text-sm font-semibold text-foreground">{vehicle.number}</p>
                {vehicle.nickname && (
                  <p className="text-xs text-muted-foreground">{vehicle.nickname}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        {recentBookings.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">Recent</h2>
            <div className="space-y-2">
              {recentBookings.map((booking) => (
                <button
                  key={booking.id}
                  onClick={() => navigate(`/receipt/${booking.id}`)}
                  className="w-full flex items-center gap-3 p-3 bg-card rounded-xl border border-border hover:border-primary/50 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <Car className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">{booking.lot.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(booking.startTime, 'dd MMM, hh:mm a')}
                    </p>
                  </div>
                  <p className="font-semibold text-foreground">₹{booking.amount}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {recentBookings.length === 0 && !activeBooking && (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Ready to park?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Search for a parking spot near your destination
            </p>
            <Button
              onClick={() => navigate('/search')}
              className="gradient-primary shadow-glow rounded-xl"
            >
              <Search className="w-4 h-4 mr-2" />
              Find Parking
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
