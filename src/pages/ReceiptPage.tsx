import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, MapPin, Clock, Car, CheckCircle, Star, Info, RotateCcw } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { format } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';

const ReceiptPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { bookings, isAuthenticated } = useApp();
  const [rating, setRating] = useState(0);

  if (!isAuthenticated) { navigate('/'); return null; }

  const booking = bookings.find((b) => b.id === id);
  if (!booking) { navigate('/booking/history'); return null; }

  const handleRate = (stars: number) => { setRating(stars); toast.success('Thanks for your feedback!'); };

  return (
    <div className="min-h-screen bg-background page-transition">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/booking/history')} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-2xl font-bold text-foreground">Receipt</h1>
        </div>

        <div className="text-center mb-6">
          {booking.status === 'CANCELLED' ? (
            <>
              <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-3">
                <RotateCcw className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-1">Booking Cancelled</h2>
              <p className="text-sm text-muted-foreground mb-3">Your booking was cancelled before check-in.</p>
              <p className="font-mono text-sm text-muted-foreground">{booking.id}</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <p className="font-mono text-sm text-muted-foreground">{booking.id}</p>
            </>
          )}
        </div>

        <div className="p-4 bg-card rounded-2xl border border-border mb-4">
          <p className="font-semibold text-lg text-foreground">{booking.lot.name}</p>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-4 h-4" />{booking.lot.address}</p>
        </div>

        <div className="p-4 bg-card rounded-2xl border border-border mb-4 space-y-3">
          <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium">{format(booking.startTime, 'dd MMM yyyy')}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="font-medium">{format(booking.startTime, 'hh:mm a')} - {format(booking.endTime, 'hh:mm a')}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Vehicle</span><span className="font-mono font-medium">{booking.vehicle.number}</span></div>
          <div className="h-px bg-border" />
          
          {booking.status === 'CANCELLED' && booking.refundAmount !== undefined ? (
            <>
              <div className="flex justify-between"><span className="text-muted-foreground">Paid</span><span className="font-medium">₹{booking.amount}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Refunded</span><span className="font-medium text-primary">₹{booking.refundAmount}</span></div>
              <div className="flex justify-between text-lg"><span className="font-medium">Net Paid</span><span className="font-bold text-foreground">₹{booking.amount - booking.refundAmount}</span></div>
            </>
          ) : (
            <div className="flex justify-between text-lg"><span className="font-medium">Total Paid</span><span className="font-bold text-primary">₹{booking.amount + (booking.overstayAmount || 0)}</span></div>
          )}
        </div>

        {/* Refund Status Badge for Cancelled Bookings */}
        {booking.status === 'CANCELLED' && booking.refundStatus && (
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Info className="w-4 h-4 text-primary" />
              <span className="font-medium text-primary">
                Refund Status: {booking.refundStatus === 'INITIATED' ? 'Initiated' : 'Completed'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {booking.refundStatus === 'INITIATED' 
                ? `₹${booking.refundAmount} refund is being processed`
                : `₹${booking.refundAmount} has been refunded to your original payment method`
              }
            </p>
          </div>
        )}
        
        {/* Cancellation Notice */}
        {booking.status === 'CANCELLED' && (
          <div className="p-4 bg-muted/10 border border-border rounded-2xl mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="w-4 h-4" />
              <span>This booking has been cancelled. QR is no longer valid.</span>
            </div>
          </div>
        )}

        {booking.status === 'COMPLETED' && rating === 0 && (
          <div className="p-4 bg-card rounded-2xl border border-border mb-4 text-center">
            <p className="font-medium text-foreground mb-3">Rate your experience</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => handleRate(star)} className="p-2"><Star className="w-8 h-8 text-muted-foreground hover:text-warning hover:fill-warning transition-colors" /></button>
              ))}
            </div>
          </div>
        )}

        <Button onClick={() => toast.success('Receipt downloaded!')} variant="outline" size="lg" className="w-full h-12 rounded-2xl">
          <Download className="w-5 h-5 mr-2" />Download Receipt
        </Button>
      </div>
    </div>
  );
};

export default ReceiptPage;
