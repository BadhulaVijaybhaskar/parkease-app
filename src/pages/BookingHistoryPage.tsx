import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Car, Clock, MapPin } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const BookingHistoryPage = () => {
  const navigate = useNavigate();
  const { bookings, isAuthenticated } = useApp();

  if (!isAuthenticated) { navigate('/'); return null; }

  const sortedBookings = [...bookings].sort((a, b) => b.startTime.getTime() - a.startTime.getTime());

  return (
    <div className="min-h-screen bg-background page-transition">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/home')} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-2xl font-bold text-foreground">Booking History</h1>
        </div>

        {sortedBookings.length === 0 ? (
          <div className="text-center py-16"><Car className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" /><p className="text-muted-foreground">No bookings yet</p></div>
        ) : (
          <div className="space-y-3">
            {sortedBookings.map((booking) => (
              <button key={booking.id} onClick={() => navigate(`/receipt/${booking.id}`)} className="w-full p-4 bg-card rounded-2xl border border-border text-left hover:border-primary/50 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div><p className="font-semibold text-foreground">{booking.lot.name}</p><p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{booking.lot.distance}</p></div>
                  <span className={cn("px-2 py-1 rounded-full text-xs font-medium", booking.status === 'COMPLETED' ? 'bg-success/20 text-success' : booking.status === 'CANCELLED' ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary')}>{booking.status}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1"><Clock className="w-4 h-4" />{format(booking.startTime, 'dd MMM, hh:mm a')}</span>
                  <div className="text-right">
                    <span className="font-semibold text-foreground">₹{booking.amount}</span>
                    {booking.status === 'CANCELLED' && booking.refundAmount !== undefined && (
                      <p className="text-xs text-primary mt-1">
                        {booking.refundStatus === 'COMPLETED' ? `Refunded ₹${booking.refundAmount}` : `Refund: ₹${booking.refundAmount} initiated`}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistoryPage;
