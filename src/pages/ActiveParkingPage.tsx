import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, QrCode, MapPin, Clock, Car, Timer, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { format, differenceInSeconds } from 'date-fns';
import { toast } from 'sonner';
import CancelBookingModal from '@/components/CancelBookingModal';

const ActiveParkingPage = () => {
  const navigate = useNavigate();
  const { activeBooking, checkIn, checkOut, cancelBooking, isAuthenticated } = useApp();
  const [timeLeft, setTimeLeft] = useState('');
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Navigation guard
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (activeBooking?.status === 'CHECKED_IN') {
        e.preventDefault();
        e.returnValue = 'Your parking session is active. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [activeBooking]);

  // Timer with urgency states
  useEffect(() => {
    if (!activeBooking) return;
    
    const interval = setInterval(() => {
      const now = new Date();
      const diff = differenceInSeconds(activeBooking.endTime, now);
      setRemainingSeconds(diff);
      
      if (diff <= 0) {
        const overstayMinutes = Math.abs(Math.floor(diff / 60));
        setTimeLeft(`${overstayMinutes} min overstay`);
      } else {
        const hours = Math.floor(diff / 3600);
        const mins = Math.floor((diff % 3600) / 60);
        if (hours > 0) {
          setTimeLeft(`${hours}h ${mins}m remaining`);
        } else {
          setTimeLeft(`${mins} minutes remaining`);
        }
      }

      // Show alerts at specific times
      if (diff === 600) { // 10 minutes
        showTimedAlert('⚠️ Parking time ending soon');
      } else if (diff === 0) { // Overstay starts
        showTimedAlert('⛔ Parking time exceeded. Please checkout.');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeBooking]);

  const showTimedAlert = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  if (!isAuthenticated || !activeBooking) {
    navigate('/home');
    return null;
  }

  const isOverstay = remainingSeconds <= 0;
  const isUrgent = remainingSeconds <= 900; // 15 minutes
  const isCheckedIn = activeBooking.status === 'CHECKED_IN';
  
  // Calculate cancellation eligibility and refund
  const minutesToStart = (activeBooking.startTime.getTime() - Date.now()) / (1000 * 60);
  const canCancel = activeBooking.status === 'PAID' && !isCheckedIn && minutesToStart > 15;
  
  let refundPercent = 0;
  if (minutesToStart > 60) refundPercent = 100;
  else if (minutesToStart > 15) refundPercent = 50;
  
  const refundAmount = Math.round(activeBooking.amount * (refundPercent / 100));
  const isCancelled = activeBooking.status === 'CANCELLED';

  if (isCancelled) {
    navigate('/home');
    return null;
  }

  const handleCheckIn = async () => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      await checkIn(activeBooking.id);
      setIsLoading(false);
      toast.success('✅ Check-in recorded successfully');
    } catch (error) {
      console.error('Failed to check in:', error);
      toast.error('Check in failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      await checkOut(activeBooking.id);
      setIsLoading(false);
      
      // Success animation and redirect
      toast.success('Parking completed. Generating receipt…');
      setTimeout(() => {
        navigate(`/receipt/${activeBooking.id}`);
      }, 1500);
    } catch (error) {
      console.error('Failed to check out:', error);
      toast.error('Check out failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    setIsCancelling(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    cancelBooking(activeBooking.id);
    setIsCancelling(false);
    setShowCancelModal(false);
    
    toast.success('Booking cancelled successfully');
    setTimeout(() => {
      navigate('/home');
    }, 1500);
  };

  const handleBackNavigation = () => {
    if (isCheckedIn) {
      const confirmed = window.confirm('Your parking session is active. Are you sure you want to leave?');
      if (!confirmed) return;
    }
    navigate('/home');
  };

  const getStatusConfig = () => {
    if (isCheckedIn && isOverstay) {
      return {
        color: 'text-destructive',
        bgColor: 'bg-destructive/20',
        icon: AlertTriangle,
        text: 'Overstay',
        pulse: true
      };
    } else if (isCheckedIn) {
      return {
        color: 'text-success',
        bgColor: 'bg-success/20',
        icon: CheckCircle,
        text: 'Parking Active',
        pulse: true
      };
    } else {
      return {
        color: 'text-warning',
        bgColor: 'bg-warning/20',
        icon: Timer,
        text: 'Upcoming',
        pulse: false
      };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="min-h-screen bg-background flex flex-col page-transition">
      {/* Alert Banner */}
      {showAlert && (
        <div className="fixed top-0 left-0 right-0 z-50 p-4 animate-slide-down">
          <div className="bg-card border border-warning rounded-lg p-3 shadow-lg max-w-md mx-auto">
            <p className="text-sm font-medium text-center">{alertMessage}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-6">
        <button 
          onClick={handleBackNavigation}
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-6 hover:bg-secondary/80 transition-colors active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Live Status */}
        <div className={`px-4 py-2 rounded-full inline-flex items-center gap-2 mb-4 animate-fade-in ${statusConfig.bgColor}`}>
          {statusConfig.pulse && <span className="w-2 h-2 bg-current rounded-full animate-pulse" />}
          <statusConfig.icon className={`w-4 h-4 ${statusConfig.color}`} />
          <span className={`font-medium ${statusConfig.color}`}>{statusConfig.text}</span>
        </div>

        <h1 className="text-2xl font-bold text-foreground">{activeBooking.lot.name}</h1>
        <p className="text-muted-foreground flex items-center gap-1 mt-1">
          <MapPin className="w-4 h-4" />
          {activeBooking.lot.address}
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* QR Code - Hidden if cancelled */}
        {!isCancelled ? (
          <div className="w-48 h-48 bg-card rounded-3xl border-2 border-primary/30 flex items-center justify-center mb-4 shadow-glow">
            <QrCode className="w-24 h-24 text-primary" />
          </div>
        ) : (
          <div className="w-48 h-48 bg-card rounded-3xl border-2 border-border/30 flex items-center justify-center mb-4">
            <QrCode className="w-24 h-24 text-muted-foreground/30" />
          </div>
        )}
        
        <p className="font-mono text-lg font-bold text-foreground mb-2">{activeBooking.id}</p>
        
        {/* Timer with Urgency */}
        <div className={`text-2xl font-bold mb-4 transition-all duration-300 ${
          isCheckedIn && isOverstay 
            ? 'text-destructive animate-pulse' 
            : isCheckedIn && isUrgent 
              ? 'text-warning' 
              : 'text-primary'
        } ${isCheckedIn && isOverstay ? 'animate-shake' : ''}`}>
          <Clock className="w-6 h-6 inline mr-2" />
          {timeLeft}
        </div>

        {/* Info Card */}
        <div className="w-full mt-4 p-4 bg-card rounded-2xl border border-border">
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Time</span>
            <span className="font-medium">
              {format(activeBooking.startTime, 'hh:mm a')} - {format(activeBooking.endTime, 'hh:mm a')}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Vehicle</span>
            <span className="font-mono font-medium">{activeBooking.vehicle.number}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Slot</span>
            <span className="font-medium">
              {(() => {
                const selectedSlot = localStorage.getItem('selectedSlot');
                if (selectedSlot) {
                  try {
                    const slot = JSON.parse(selectedSlot);
                    return slot.label || 'Not selected';
                  } catch {
                    return 'Not selected';
                  }
                }
                return 'Not selected';
              })()
              }
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-bold text-primary">₹{activeBooking.amount}</span>
          </div>
        </div>

        {/* Reassurance Info */}
        <div className="w-full mt-4 p-3 bg-secondary/30 rounded-xl border border-border/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Info className="w-4 h-4" />
            <span>Your slot is reserved until you checkout</span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="p-6 bg-background border-t border-border space-y-3">
        {/* Refund Status Badge */}
        {isCancelled && activeBooking.refundStatus && (
          <div className="p-3 bg-success/10 border border-success/20 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-success">
                  {activeBooking.refundStatus === 'INITIATED' ? 'Refund Initiated' : 'Refund Completed'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activeBooking.refundStatus === 'INITIATED' 
                    ? `₹${activeBooking.refundAmount} refund initiated`
                    : `₹${activeBooking.refundAmount} refunded to original payment method`
                  }
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Cancellation Cut-off Message */}
        {activeBooking.status === 'PAID' && !canCancel && minutesToStart <= 15 && minutesToStart > 0 && (
          <div className="p-3 bg-warning/10 border border-warning/20 rounded-xl">
            <p className="text-sm text-warning font-medium">
              Cancellation closed (less than 15 mins to start)
            </p>
          </div>
        )}
        
        {/* Cancel Booking Button - Only show if cancellation is allowed */}
        {canCancel && (
          <Button 
            onClick={() => setShowCancelModal(true)}
            variant="ghost"
            size="lg" 
            className="w-full h-12 text-base font-medium rounded-xl text-destructive hover:bg-destructive/5"
            disabled={showCancelModal}
          >
            Cancel Booking
          </Button>
        )}
        
        {activeBooking.status === 'PAID' && !isCancelled && (
          <Button 
            onClick={handleCheckIn}
            disabled={isLoading || showCancelModal}
            size="lg" 
            className="w-full h-14 text-lg font-semibold gradient-primary rounded-2xl shadow-glow active:scale-95 transition-transform"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              'Check In'
            )}
          </Button>
        )}
        
        {activeBooking.status === 'CHECKED_IN' && (
          <Button 
            onClick={handleCheckOut}
            disabled={isLoading}
            size="lg" 
            className={`w-full h-14 text-lg font-semibold rounded-2xl active:scale-95 transition-transform ${
              isCheckedIn && isOverstay 
                ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground animate-pulse' 
                : 'gradient-accent shadow-accent-glow'
            }`}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              isCheckedIn && isOverstay ? 'Pay & Exit' : 'Proceed to Exit'
            )}
          </Button>
        )}
      </div>

      {/* Cancel Booking Modal */}
      <CancelBookingModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelBooking}
        isLoading={isCancelling}
        refundAmount={refundAmount}
        refundPercent={refundPercent}
      />
    </div>
  );
};

export default ActiveParkingPage;