import { ParkingSlot } from '@/data/slotData';
import SlotCell from './SlotCell';

interface SlotGridProps {
  slots: ParkingSlot[];
  selectedSlot: ParkingSlot | null;
  onSlotSelect: (slot: ParkingSlot) => void;
}

const SlotGrid = ({ slots, selectedSlot, onSlotSelect }: SlotGridProps) => {
  // Group slots by row
  const slotsByRow = slots.reduce((acc, slot) => {
    if (!acc[slot.row]) {
      acc[slot.row] = [];
    }
    acc[slot.row].push(slot);
    return acc;
  }, {} as Record<string, ParkingSlot[]>);

  // Sort rows and positions
  const sortedRows = Object.keys(slotsByRow).sort();

  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <div className="space-y-4">
        {sortedRows.map((row) => (
          <div key={row} className="flex items-center gap-3">
            {/* Row Label */}
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center font-bold text-secondary-foreground">
              {row}
            </div>
            
            {/* Slots in Row */}
            <div className="flex gap-2 flex-1">
              {slotsByRow[row]
                .sort((a, b) => a.position - b.position)
                .map((slot) => (
                  <SlotCell
                    key={slot.id}
                    slot={slot}
                    isSelected={selectedSlot?.id === slot.id}
                    onClick={onSlotSelect}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Entrance Indicator */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          <span className="text-sm font-medium text-muted-foreground">Entrance</span>
        </div>
      </div>
    </div>
  );
};

export default SlotGrid;