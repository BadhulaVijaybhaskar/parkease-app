import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { QrCode, Navigation, Clock, Car, CheckCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { format } from 'date-fns';

const BookingConfirmationPage = () => {
  const navigate = useNavigate();
  const { activeBooking, isAuthenticated } = useApp();

  if (!isAuthenticated || !activeBooking) {
    navigate('/home');
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col p-6 page-transition">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mb-6 animate-scale-in">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
        <p className="text-muted-foreground mb-8">Your parking spot is reserved</p>

        {/* QR Code */}
        <div className="w-48 h-48 bg-card rounded-3xl border-2 border-dashed border-primary/30 flex items-center justify-center mb-4">
          <QrCode className="w-24 h-24 text-primary" />
        </div>
        <p className="font-mono text-sm text-muted-foreground mb-6">{activeBooking.id}</p>

        {/* Details */}
        <div className="w-full p-4 bg-card rounded-2xl border border-border text-left mb-4">
          <p className="font-semibold text-foreground">{activeBooking.lot.name}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{format(activeBooking.startTime, 'hh:mm a')}</span>
            <span className="flex items-center gap-1"><Car className="w-4 h-4" />{activeBooking.vehicle.number}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Button onClick={() => navigate('/booking/active')} size="lg" className="w-full h-14 text-lg font-semibold gradient-primary rounded-2xl shadow-glow">
          <Navigation className="w-5 h-5 mr-2" />View Booking
        </Button>
        <Button onClick={() => navigate('/home')} variant="outline" size="lg" className="w-full h-12 rounded-2xl">
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
