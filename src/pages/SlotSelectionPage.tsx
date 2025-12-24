import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { mockSlots, ParkingSlot } from '@/data/slotData';
import BackButton from '@/components/BackButton';
import SlotCell from '@/components/SlotCell';

const SlotSelectionPage = () => {
  const navigate = useNavigate();
  const { currentBooking, isAuthenticated, hasVehicle } = useApp();
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [availableSlots, setAvailableSlots] = useState<ParkingSlot[]>(mockSlots);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !hasVehicle || !currentBooking.lot) {
      navigate('/');
    }
  }, [isAuthenticated, hasVehicle, currentBooking.lot, navigate]);

  if (!isAuthenticated || !hasVehicle || !currentBooking.lot) {
    return null;
  }

  const handleSlotSelect = (slot: ParkingSlot) => {
    if (slot.status === 'AVAILABLE') {
      const newSelection = selectedSlot?.id === slot.id ? null : slot;
      setSelectedSlot(newSelection);
    }
  };

  const handleContinue = () => {
    if (selectedSlot) {
      // Store selected slot for booking summary
      const holdExpiresAt = Date.now() + 5 * 60 * 1000;
      const slotData = {
        ...selectedSlot,
        holdExpiresAt
      };
      localStorage.setItem('selectedSlot', JSON.stringify(slotData));
      navigate('/booking/summary');
    }
  };

  return (
    <div className="min-h-screen bg-background page-transition">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-primary/20 to-accent/20 p-6">
        <div className="flex items-center gap-4 mb-6">
          <BackButton 
            fallback="/lot-details" 
            className="bg-card/90 backdrop-blur hover:bg-card shadow-lg border border-border/50" 
          />
          <div>
            <h1 className="text-xl font-bold text-foreground">Select Your Slot</h1>
            <p className="text-sm text-muted-foreground">{currentBooking.lot?.name}</p>
          </div>
        </div>

        {/* Selected Slot Display */}
        {selectedSlot && (
          <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Selected Slot</p>
                <p className="text-lg font-bold text-primary">{selectedSlot.label}</p>
              </div>
              <button
                onClick={() => setSelectedSlot(null)}
                className="text-sm text-primary font-medium hover:underline"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Slot Grid */}
      <div className="p-6 pb-24">
        <div className="bg-card rounded-2xl p-6 border border-border max-h-[60vh] overflow-y-auto">
          {/* Desktop Layout */}
          <div className="hidden md:block">
            <div className="space-y-4 mb-6">
              {['A', 'B', 'C'].map((row) => (
                <div key={row} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center font-bold text-primary text-sm flex-shrink-0">
                    {row}
                  </div>
                  <div className="overflow-x-auto flex-1 scrollbar-hide">
                    <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
                      {availableSlots
                        .filter(slot => slot.row === row)
                        .sort((a, b) => a.position - b.position)
                        .map((slot) => (
                          <div key={slot.id} className="flex-shrink-0">
                            <SlotCell
                              slot={slot}
                              isSelected={selectedSlot?.id === slot.id}
                              onClick={handleSlotSelect}
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden">
            {['A', 'B', 'C'].map((row) => (
              <div key={row} className="mb-4">
                <div className="mb-2 font-semibold text-sm text-primary">{row}</div>
                <div className="overflow-x-auto scrollbar-hide">
                  <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
                    {availableSlots
                      .filter(slot => slot.row === row)
                      .sort((a, b) => a.position - b.position)
                      .map((slot) => (
                        <div key={slot.id} className="flex-shrink-0">
                          <SlotCell
                            slot={slot}
                            isSelected={selectedSlot?.id === slot.id}
                            onClick={handleSlotSelect}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Entrance Indicator */}
          <div className="flex items-center justify-center gap-2 text-sm text-primary font-medium mb-4">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span>Entrance</span>
          </div>

          {/* Legend */}
          <div className="slot-legend">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border border-primary rounded"></div>
              <span className="text-primary/80">Available</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-primary rounded"></div>
              <span className="text-primary/80">Selected</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-400 rounded"></div>
              <span className="text-primary/80">Occupied</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-200 rounded"></div>
              <span className="text-primary/80">Blocked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <Button
          onClick={handleContinue}
          disabled={!selectedSlot}
          size="lg"
          className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 transition-all shadow-glow rounded-2xl disabled:opacity-50"
        >
          {selectedSlot ? `Continue with Slot ${selectedSlot.label}` : 'Select a Slot First'}
        </Button>
      </div>
    </div>
  );
};

export default SlotSelectionPage;