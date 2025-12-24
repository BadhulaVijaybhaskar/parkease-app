import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  refundAmount: number;
  refundPercent: number;
}

const CancelBookingModal = ({ isOpen, onClose, onConfirm, isLoading = false, refundAmount, refundPercent }: CancelBookingModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-sm animate-scale-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-warning" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Cancel booking?</h2>
        </div>
        
        <p className="text-muted-foreground mb-6">
          You will receive <span className="font-semibold text-primary">₹{refundAmount} refund ({refundPercent}% of booking amount)</span> as per cancellation policy.
        </p>
        
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 h-12 rounded-xl"
            disabled={isLoading}
          >
            Keep Booking
          </Button>
          <Button
            onClick={onConfirm}
            variant="destructive"
            className="flex-1 h-12 rounded-xl"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Cancel Booking'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal;