import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Clock, Car, Bike, ChevronDown, Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import BackButton from '@/components/BackButton';
import HoldTimer from '@/components/HoldTimer';
import { ENABLE_SLOT_SELECTION } from '@/data/slotData';

const BookingSummaryPage = () => {
  const navigate = useNavigate();
  const { currentBooking, vehicles, setCurrentBookingVehicle, isAuthenticated, hasVehicle } = useApp();
  const [selectedVehicle, setSelectedVehicle] = useState(currentBooking.vehicle || vehicles[0]);
  const [showVehicleSelect, setShowVehicleSelect] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [holdExpired, setHoldExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load selected slot from localStorage
  useEffect(() => {
    if (ENABLE_SLOT_SELECTION) {
      const stored = localStorage.getItem('selectedSlot');
      console.log('Loading slot from localStorage:', stored);
      if (stored) {
        const slot = JSON.parse(stored);
        if (slot.holdExpiresAt > Date.now()) {
          console.log('Setting selectedSlot from localStorage:', slot);
          setSelectedSlot(slot);
        } else {
          console.log('Slot hold expired');
          setHoldExpired(true);
        }
      }
    }
    setIsLoading(false);
  }, []);

  // Redirect if not ready (using useEffect)
  useEffect(() => {
    if (isLoading) {
      console.log('Still loading, skipping redirect checks');
      return;
    }
    
    console.log('BookingSummary useEffect - checking conditions');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('hasVehicle:', hasVehicle);
    console.log('currentBooking:', currentBooking);
    console.log('selectedSlot:', selectedSlot);
    console.log('holdExpired:', holdExpired);
    
    if (!isAuthenticated || !hasVehicle) {
      console.log('Redirecting to / - not authenticated');
      navigate('/');
    } else if (!currentBooking.lot || !currentBooking.startTime || !currentBooking.endTime) {
      console.log('Redirecting to /search - missing booking data');
      navigate('/search');
    } else if (ENABLE_SLOT_SELECTION && !selectedSlot && !holdExpired) {
      console.log('Redirecting to slot selection - no slot selected');
      navigate(`/lot/${currentBooking.lot?.id}`);
    }
  }, [isAuthenticated, hasVehicle, currentBooking, navigate, selectedSlot, holdExpired, isLoading]);

  if (!isAuthenticated || !hasVehicle || !currentBooking.lot || !currentBooking.startTime || !currentBooking.endTime || isLoading) {
    return null;
  }

  const handleHoldExpire = () => {
    localStorage.removeItem('selectedSlot');
    setSelectedSlot(null);
    setHoldExpired(true);
    toast.error('Slot hold expired. Please select again.');
    navigate(`/lot/${currentBooking.lot.id}/slots`);
  };

  const { lot, startTime, endTime } = currentBooking;
  const hours = Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60));
  const totalAmount = hours * lot.pricePerHour;

  // Filter vehicles by lot's accepted types
  const compatibleVehicles = vehicles.filter((v) => lot.vehicleTypes.includes(v.type));

  const handleProceed = () => {
    if (!selectedVehicle) {
      toast.error('Please select a vehicle');
      return;
    }

    if (!lot.vehicleTypes.includes(selectedVehicle.type)) {
      toast.error(`This parking lot doesn't accept ${selectedVehicle.type}s`);
      return;
    }

    setCurrentBookingVehicle(selectedVehicle);
    navigate('/booking/payment');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col page-transition">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <BackButton fallback={ENABLE_SLOT_SELECTION ? `/lot/${lot.id}/slots` : `/lot/${lot.id}`} />
          <h1 className="text-2xl font-bold text-foreground">Booking Summary</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 space-y-4">
        {/* Hold Timer */}
        {ENABLE_SLOT_SELECTION && selectedSlot && selectedSlot.holdExpiresAt && (
          <HoldTimer
            expiresAt={selectedSlot.holdExpiresAt}
            slotLabel={selectedSlot.label}
            onExpire={handleHoldExpire}
          />
        )}

        {/* Selected Slot */}
        {ENABLE_SLOT_SELECTION && selectedSlot && (
          <div className="p-4 bg-card rounded-2xl border border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Selected Parking Slot</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">{selectedSlot.label}</p>
                <p className="text-sm text-muted-foreground">Row {selectedSlot.row}, Position {selectedSlot.position}</p>
              </div>
              <button
                onClick={() => navigate(`/lot/${lot.id}/slots`)}
                className="text-sm text-primary font-medium hover:underline"
              >
                Change
              </button>
            </div>
          </div>
        )}
        {/* Parking Lot */}
        <div className="p-4 bg-card rounded-2xl border border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Parking Location</h3>
          <p className="font-semibold text-lg text-foreground">{lot.name}</p>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="w-4 h-4" />
            {lot.address}
          </p>
        </div>

        {/* Time */}
        <div className="p-4 bg-card rounded-2xl border border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Date & Time</h3>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <p className="font-semibold text-foreground">
                {format(startTime, 'EEEE, MMMM d, yyyy')}
              </p>
              <p className="text-sm text-muted-foreground">
                {format(startTime, 'hh:mm a')} - {format(endTime, 'hh:mm a')} ({hours} {hours === 1 ? 'hour' : 'hours'})
              </p>
            </div>
          </div>
        </div>

        {/* Vehicle Selection */}
        <div className="p-4 bg-card rounded-2xl border border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Select Vehicle</h3>
          
          {compatibleVehicles.length === 0 ? (
            <div className="p-3 bg-destructive/10 rounded-xl text-center">
              <p className="text-sm text-destructive">
                No compatible vehicles. This lot only accepts: {lot.vehicleTypes.join(', ')}
              </p>
              <Button
                variant="link"
                onClick={() => navigate('/profile')}
                className="text-primary"
              >
                Add a {lot.vehicleTypes[0]}
              </Button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowVehicleSelect(!showVehicleSelect)}
                className="w-full flex items-center justify-between p-3 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {selectedVehicle?.type === 'car' ? (
                    <Car className="w-5 h-5 text-primary" />
                  ) : (
                    <Bike className="w-5 h-5 text-accent" />
                  )}
                  <div className="text-left">
                    <p className="font-mono font-semibold text-foreground">
                      {selectedVehicle?.number}
                    </p>
                    {selectedVehicle?.nickname && (
                      <p className="text-xs text-muted-foreground">{selectedVehicle.nickname}</p>
                    )}
                  </div>
                </div>
                <ChevronDown className={cn(
                  "w-5 h-5 text-muted-foreground transition-transform",
                  showVehicleSelect && "rotate-180"
                )} />
              </button>

              {showVehicleSelect && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-10 overflow-hidden">
                  {compatibleVehicles.map((vehicle) => (
                    <button
                      key={vehicle.id}
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setShowVehicleSelect(false);
                      }}
                      className="w-full flex items-center justify-between p-3 hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {vehicle.type === 'car' ? (
                          <Car className="w-5 h-5 text-primary" />
                        ) : (
                          <Bike className="w-5 h-5 text-accent" />
                        )}
                        <div className="text-left">
                          <p className="font-mono font-semibold text-foreground">{vehicle.number}</p>
                          {vehicle.nickname && (
                            <p className="text-xs text-muted-foreground">{vehicle.nickname}</p>
                          )}
                        </div>
                      </div>
                      {selectedVehicle?.id === vehicle.id && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="p-4 bg-card rounded-2xl border border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Price Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-foreground">
              <span>Parking rate</span>
              <span>₹{lot.pricePerHour}/hour</span>
            </div>
            <div className="flex justify-between text-foreground">
              <span>Duration</span>
              <span>{hours} {hours === 1 ? 'hour' : 'hours'}</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between text-lg font-bold text-foreground">
              <span>Total</span>
              <span className="text-primary">₹{totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Terms */}
        <p className="text-xs text-muted-foreground text-center">
          By proceeding, you agree to the parking terms and conditions. Overstay charges apply at 1.5x the hourly rate.
        </p>
      </div>

      {/* Footer */}
      <div className="p-6">
        <Button
          onClick={handleProceed}
          disabled={!selectedVehicle || compatibleVehicles.length === 0}
          size="lg"
          className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 transition-all shadow-glow rounded-2xl disabled:opacity-50"
        >
          Proceed to Pay ₹{totalAmount}
        </Button>
      </div>
    </div>
  );
};

export default BookingSummaryPage;
