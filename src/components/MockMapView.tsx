import { ParkingLot } from '@/data/mockData';
import { MapPin, Car, Bike } from 'lucide-react';

interface MockMapViewProps {
  lots: ParkingLot[];
  onSelectLot: (lot: ParkingLot) => void;
}

const MockMapView = ({ lots, onSelectLot }: MockMapViewProps) => {
  const positions = [
    { top: '25%', left: '45%' },
    { top: '40%', left: '60%' },
    { top: '35%', left: '30%' },
    { top: '60%', left: '50%' },
    { top: '70%', left: '35%' },
  ];

  return (
    <div className="relative h-[calc(100vh-140px)] w-full">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 rounded-2xl border border-border overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="border border-gray-300" />
            ))}
          </div>
        </div>
        
        <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-gray-300 opacity-30" />
        <div className="absolute top-2/3 left-0 right-0 h-0.5 bg-gray-300 opacity-30" />
        <div className="absolute top-0 bottom-0 left-1/3 w-0.5 bg-gray-300 opacity-30" />
        <div className="absolute top-0 bottom-0 left-2/3 w-0.5 bg-gray-300 opacity-30" />
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse shadow-lg" />
        <div className="absolute -top-1 -left-1 w-6 h-6 bg-blue-600/20 rounded-full animate-ping" />
      </div>

      {lots.slice(0, 5).map((lot, index) => {
        const position = positions[index] || positions[0];
        return (
          <button
            key={lot.id}
            style={{
              top: position.top,
              left: position.left,
            }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 group"
            onClick={() => onSelectLot(lot)}
          >
            <div className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all group-hover:scale-110 ${
              lot.availability ? 'bg-primary' : 'bg-gray-400'
            }`}>
              <span className="text-white font-bold text-sm">₹</span>
            </div>
            
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-card border border-border rounded-lg p-3 shadow-lg min-w-[200px]">
                <h4 className="font-semibold text-foreground text-sm">{lot.name}</h4>
                <p className="text-xs text-muted-foreground mb-2">{lot.distance} away</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold">₹{lot.pricePerHour}/hr</span>
                  <div className="flex gap-1">
                    {lot.vehicleTypes.includes('car') && <Car className="w-3 h-3 text-primary" />}
                    {lot.vehicleTypes.includes('bike') && <Bike className="w-3 h-3 text-accent" />}
                  </div>
                </div>
                {lot.availability ? (
                  <p className="text-xs text-success mt-1">{lot.availableSlots} spots left</p>
                ) : (
                  <p className="text-xs text-destructive mt-1">Full</p>
                )}
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border" />
            </div>
          </button>
        );
      })}

      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2">
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          Map view (demo)
        </p>
      </div>

      <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full" />
            <span className="text-xs text-muted-foreground">Your location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <span className="text-xs text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full" />
            <span className="text-xs text-muted-foreground">Full</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockMapView;