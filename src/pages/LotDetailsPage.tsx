import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Star, Clock, Car, Bike, Shield, Zap, Droplets, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { mockParkingLots } from '@/data/mockData';
import { ENABLE_SLOT_SELECTION } from '@/data/slotData';
import { format } from 'date-fns';
import BackButton from '@/components/BackButton';
import { useEffect } from 'react';

const LotDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentBooking, setCurrentBookingLot, isAuthenticated, hasVehicle } = useApp();

  // Redirect if not authenticated (using useEffect to avoid render issues)
  useEffect(() => {
    if (!isAuthenticated || !hasVehicle) {
      navigate('/');
    }
  }, [isAuthenticated, hasVehicle, navigate]);

  const lot = mockParkingLots.find((l) => l.id === id);

  useEffect(() => {
    if (lot === undefined) {
      navigate('/results');
    }
  }, [lot, navigate]);

  if (!isAuthenticated || !hasVehicle || !lot) {
    return null;
  }

  const handleReserve = () => {
    console.log('Reserve clicked');
    console.log('Setting current booking lot:', lot);
    setCurrentBookingLot(lot);
    
    if (ENABLE_SLOT_SELECTION) {
      console.log('Navigating to slot selection');
      navigate('/slot-selection');
    } else {
      console.log('Navigating to /booking/summary');
      navigate('/booking/summary');
    }
  };



  const amenityIcons: Record<string, React.ReactNode> = {
    'CCTV': <Shield className="w-4 h-4" />,
    'Covered': <Droplets className="w-4 h-4" />,
    '24/7 Security': <Shield className="w-4 h-4" />,
    'EV Charging': <Zap className="w-4 h-4" />,
  };

  const calculateEstimate = () => {
    if (!currentBooking.startTime || !currentBooking.endTime) return null;
    const hours = Math.ceil(
      (currentBooking.endTime.getTime() - currentBooking.startTime.getTime()) / (1000 * 60 * 60)
    );
    return hours * lot.pricePerHour;
  };

  const estimate = calculateEstimate();

  return (
    <div className="min-h-screen bg-background page-transition">
      {/* Header */}
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex flex-col justify-center items-center">
        <div className="absolute top-4 left-4 z-10">
          <BackButton 
            fallback="/results" 
            className="bg-card/90 backdrop-blur hover:bg-card shadow-lg border border-border/50" 
          />
        </div>
        
        <div className="flex items-center justify-center">
          <Car className="w-20 h-20 text-primary/30" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 -mt-6 relative">
        <div className="bg-card rounded-t-3xl p-6 border border-border">
          {/* Selected Slot Display - Remove this section */}
          {/* Title */}
          <div className="mb-4">
            <div className="flex items-start justify-between">
              <h1 className="text-2xl font-bold text-foreground">{lot.name}</h1>
              <div className="flex items-center gap-1 bg-warning/10 px-2 py-1 rounded-lg">
                <Star className="w-4 h-4 text-warning fill-warning" />
                <span className="font-semibold text-sm">{lot.rating}</span>
              </div>
            </div>
            <p className="text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" />
              {lot.address}
            </p>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="text-center p-3 bg-secondary rounded-xl">
              <p className="text-2xl font-bold text-primary">₹{lot.pricePerHour}</p>
              <p className="text-xs text-muted-foreground">per hour</p>
            </div>
            <div className="text-center p-3 bg-secondary rounded-xl">
              <p className="text-2xl font-bold text-foreground">{lot.availableSlots}</p>
              <p className="text-xs text-muted-foreground">spots left</p>
            </div>
            <div className="text-center p-3 bg-secondary rounded-xl">
              <p className="text-2xl font-bold text-foreground">{lot.distance}</p>
              <p className="text-xs text-muted-foreground">away</p>
            </div>
          </div>

          {/* Vehicle Types */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3">Vehicle Types Accepted</h3>
            <div className="flex gap-3">
              {lot.vehicleTypes.map((type) => (
                <div
                  key={type}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary"
                >
                  {type === 'car' ? <Car className="w-5 h-5" /> : <Bike className="w-5 h-5" />}
                  <span className="font-medium capitalize">{type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timing */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3">Operating Hours</h3>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-5 h-5" />
              <span>
                {lot.openTime === '00:00' && lot.closeTime === '23:59'
                  ? 'Open 24 hours'
                  : `${lot.openTime} - ${lot.closeTime}`}
              </span>
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {lot.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary text-secondary-foreground"
                >
                  {amenityIcons[amenity] || <CheckCircle2 className="w-4 h-4" />}
                  <span className="text-sm">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Time Summary */}
          {currentBooking.startTime && currentBooking.endTime && (
            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Your booking</span>
                <button
                  onClick={() => navigate('/search')}
                  className="text-sm text-primary font-medium hover:underline"
                >
                  Change
                </button>
              </div>
              <p className="font-semibold text-foreground">
                {format(currentBooking.startTime, 'EEE, MMM d')} •{' '}
                {format(currentBooking.startTime, 'hh:mm a')} -{' '}
                {format(currentBooking.endTime, 'hh:mm a')}
              </p>
              {estimate && (
                <p className="text-sm text-muted-foreground mt-1">
                  Estimated total: <span className="font-semibold text-primary">₹{estimate}</span>
                </p>
              )}
            </div>
          )}

          {/* Rules */}
          <div className="p-4 bg-warning/5 rounded-2xl border border-warning/20">
            <h3 className="font-semibold text-foreground mb-2">Parking Rules</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Valid ID required at entry</li>
              <li>• Vehicle number must match booking</li>
              <li>• No overnight parking without extended booking</li>
              <li>• Overstay charges: 1.5x hourly rate</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <Button
          onClick={handleReserve}
          disabled={!lot.availability}
          size="lg"
          className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 transition-all shadow-glow rounded-2xl disabled:opacity-50"
        >
          {!lot.availability ? 'Currently Full' : (ENABLE_SLOT_SELECTION ? 'Select Slot' : 'Reserve Parking')}
        </Button>
      </div>
    </div>
  );
};

export default LotDetailsPage;
