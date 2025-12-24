import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { generateBookingId, generateQRToken, calculateParkingAmount } from '@/data/mockData';
import { toast } from 'sonner';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { currentBooking, confirmBooking, isAuthenticated } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isAuthenticated || !currentBooking.lot || !currentBooking.vehicle || !currentBooking.startTime || !currentBooking.endTime) {
    navigate('/home');
    return null;
  }

  const { lot, vehicle, startTime, endTime } = currentBooking;
  const amount = calculateParkingAmount(lot, startTime, endTime);

  const handlePayment = async (success: boolean) => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (success) {
      const booking = {
        id: generateBookingId(),
        lotId: lot.id,
        lot,
        vehicleId: vehicle.id,
        vehicle,
        startTime,
        endTime,
        status: 'PAID' as const,
        amount,
        qrToken: generateQRToken(),
      };
      confirmBooking(booking);
      toast.success('Payment successful!');
      navigate('/booking/confirmation');
    } else {
      toast.error('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-6 page-transition">
      <button onClick={() => navigate('/booking/summary')} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-6">
        <ArrowLeft className="w-5 h-5" />
      </button>

      <h1 className="text-2xl font-bold text-foreground mb-2">Payment</h1>
      <p className="text-muted-foreground mb-8">Complete your booking</p>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mb-6">
          <CreditCard className="w-10 h-10 text-primary-foreground" />
        </div>
        <p className="text-4xl font-bold text-foreground mb-2">₹{amount}</p>
        <p className="text-muted-foreground mb-8">Total amount</p>

        <div className="p-4 bg-accent/10 rounded-2xl border border-accent/20 w-full mb-4">
          <p className="text-sm text-accent text-center font-medium">Demo Mode: Choose payment outcome</p>
        </div>
      </div>

      <div className="space-y-3">
        <Button onClick={() => handlePayment(true)} disabled={isProcessing} size="lg" className="w-full h-14 text-lg font-semibold gradient-primary rounded-2xl shadow-glow">
          {isProcessing ? <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <><CheckCircle className="w-5 h-5 mr-2" />Simulate Success</>}
        </Button>
        <Button onClick={() => handlePayment(false)} disabled={isProcessing} variant="outline" size="lg" className="w-full h-14 text-lg rounded-2xl border-destructive text-destructive hover:bg-destructive/10">
          <XCircle className="w-5 h-5 mr-2" />Simulate Failure
        </Button>
      </div>
    </div>
  );
};

export default PaymentPage;
