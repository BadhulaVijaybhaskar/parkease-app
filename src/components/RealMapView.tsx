import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { ParkingLot } from '@/data/mockData';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RealMapViewProps {
  lots: ParkingLot[];
  onSelectLot: (lot: ParkingLot) => void;
}

const RealMapView = ({ lots, onSelectLot }: RealMapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Bangalore coordinates
    const bangaloreCenter: [number, number] = [12.9716, 77.5946];
    
    // Initialize map
    const map = L.map(mapRef.current).setView(bangaloreCenter, 13);
    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // User location marker
    const userIcon = L.divIcon({
      html: '<div style="background: #2563eb; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
      className: 'user-location-marker',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    L.marker(bangaloreCenter, { icon: userIcon })
      .addTo(map)
      .bindPopup('Your Location');

    // Simulated coordinates for parking lots around Bangalore
    const lotCoordinates: [number, number][] = [
      [12.9716, 77.5946], // City Center
      [12.9698, 77.6006], // Brigade Road area
      [12.9760, 77.5900], // Metro Station area
      [12.9850, 77.6100], // Tech Park area
      [12.9650, 77.5800], // Hospital area
    ];

    // Add parking lot markers
    lots.slice(0, 5).forEach((lot, index) => {
      const coords = lotCoordinates[index] || bangaloreCenter;
      
      // Custom parking icon
      const parkingIcon = L.divIcon({
        html: `<div style="
          background: ${lot.availability ? '#1B9A8E' : '#9CA3AF'}; 
          color: white; 
          width: 32px; 
          height: 32px; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-weight: bold; 
          font-size: 14px;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
        ">₹</div>`,
        className: 'parking-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker(coords, { icon: parkingIcon }).addTo(map);
      
      // Popup content
      const popupContent = `
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-weight: 600;">${lot.name}</h3>
          <p style="margin: 0 0 8px 0; color: #666; font-size: 12px;">${lot.distance} away</p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-weight: bold; color: #1B9A8E;">₹${lot.pricePerHour}/hr</span>
            <div style="display: flex; gap: 4px;">
              ${lot.vehicleTypes.includes('car') ? '<span style="background: #1B9A8E; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">CAR</span>' : ''}
              ${lot.vehicleTypes.includes('bike') ? '<span style="background: #FF6B47; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">BIKE</span>' : ''}
            </div>
          </div>
          ${lot.availability 
            ? `<p style="margin: 0; color: #059669; font-size: 12px;">${lot.availableSlots} spots left</p>` 
            : '<p style="margin: 0; color: #DC2626; font-size: 12px;">Full</p>'
          }
          <button onclick="window.selectParkingLot('${lot.id}')" style="
            width: 100%; 
            margin-top: 8px; 
            padding: 8px; 
            background: #1B9A8E; 
            color: white; 
            border: none; 
            border-radius: 6px; 
            cursor: pointer;
            font-weight: 500;
          ">View Details</button>
        </div>
      `;

      marker.bindPopup(popupContent);
    });

    // Global function for popup button clicks
    (window as any).selectParkingLot = (lotId: string) => {
      const lot = lots.find(l => l.id === lotId);
      if (lot) {
        onSelectLot(lot);
      }
    };

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      delete (window as any).selectParkingLot;
    };
  }, [lots, onSelectLot]);

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="h-[calc(100vh-140px)] w-full rounded-2xl overflow-hidden border border-border"
      />
      
      {/* Demo Label */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 z-[1000]">
        <p className="text-xs text-muted-foreground">
          Real map with simulated parking data
        </p>
      </div>
    </div>
  );
};

export default RealMapView;