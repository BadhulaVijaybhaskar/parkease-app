import { ParkingSlot } from '@/data/slotData';
import { cn } from '@/lib/utils';

interface SlotCellProps {
  slot: ParkingSlot;
  isSelected: boolean;
  onClick: (slot: ParkingSlot) => void;
}

const SlotCell = ({ slot, isSelected, onClick }: SlotCellProps) => {
  const getSlotStyles = () => {
    if (isSelected) {
      return 'bg-primary text-primary-foreground';
    }
    
    switch (slot.status) {
      case 'AVAILABLE':
        return 'bg-primary/10 text-primary hover:bg-primary/20';
      case 'OCCUPIED':
        return 'bg-gray-400 text-white cursor-not-allowed';
      case 'BLOCKED':
        return 'bg-gray-200 text-gray-500 cursor-not-allowed';
      case 'HELD':
        return 'bg-primary text-primary-foreground';
      default:
        return 'bg-gray-100';
    }
  };

  const isClickable = slot.status === 'AVAILABLE' || isSelected;

  return (
    <button
      onClick={() => isClickable && onClick(slot)}
      disabled={!isClickable}
      className={cn(
        'w-12 h-12 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95',
        getSlotStyles(),
        !isClickable && 'cursor-not-allowed'
      )}
    >
      {slot.label}
    </button>
  );
};

export default SlotCell;