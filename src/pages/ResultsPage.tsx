import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Car, Bike, Clock, Filter, Map, List } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { mockParkingLots, ParkingLot } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import RealMapView from '@/components/RealMapView';

const ResultsPage = () => {
  const navigate = useNavigate();
  const { currentBooking, setCurrentBookingLot, isAuthenticated, hasVehicle } = useApp();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filter, setFilter] = useState<'all' | 'car' | 'bike'>('all');

  // Redirect if not authenticated
  if (!isAuthenticated || !hasVehicle) {
    navigate('/');
    return null;
  }

  const filteredLots = mockParkingLots.filter((lot) => {
    if (filter === 'all') return true;
    return lot.vehicleTypes.includes(filter);
  });

  const handleSelectLot = (lot: ParkingLot) => {
    setCurrentBookingLot(lot);
    navigate(`/lot/${lot.id}`);
  };

  const formatDuration = () => {
    if (!currentBooking.startTime || !currentBooking.endTime) return '';
    return `${format(currentBooking.startTime, 'hh:mm a')} - ${format(currentBooking.endTime, 'hh:mm a')}`;
  };

  return (
    <div className="min-h-screen bg-background page-transition">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="p-4">
          <div className="flex items-center gap-4 mb-3">
            <button
              onClick={() => navigate('/search')}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-secondary-foreground" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">Available Parking</h1>
              {currentBooking.startTime && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDuration()}
                </p>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <div className="flex gap-2 flex-1 overflow-x-auto">
              {[
                { value: 'all', label: 'All' },
                { value: 'car', label: 'Car', icon: Car },
                { value: 'bike', label: 'Bike', icon: Bike },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setFilter(value as typeof filter)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap',
                    filter === value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  )}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {label}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex rounded-full bg-secondary p-1">
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded-full transition-all',
                  viewMode === 'list' ? 'bg-card shadow-sm' : ''
                )}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={cn(
                  'p-2 rounded-full transition-all',
                  viewMode === 'map' ? 'bg-card shadow-sm' : ''
                )}
              >
                <Map className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {viewMode === 'list' ? (
        <div className="p-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            {filteredLots.length} parking spots found
          </p>

          {filteredLots.map((lot) => (
            <button
              key={lot.id}
              onClick={() => handleSelectLot(lot)}
              disabled={!lot.availability}
              className={cn(
                'w-full p-4 bg-card rounded-2xl border border-border text-left transition-all',
                lot.availability
                  ? 'hover:border-primary hover:shadow-md'
                  : 'opacity-60 cursor-not-allowed'
              )}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg">{lot.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" />
                    {lot.distance} away
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">₹{lot.pricePerHour}</p>
                  <p className="text-xs text-muted-foreground">/hour</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-warning fill-warning" />
                  <span className="text-sm font-medium">{lot.rating}</span>
                  <span className="text-sm text-muted-foreground">({lot.reviews})</span>
                </div>
                <div className="flex items-center gap-1">
                  {lot.vehicleTypes.includes('car') && (
                    <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                      <Car className="w-3.5 h-3.5 text-primary" />
                    </div>
                  )}
                  {lot.vehicleTypes.includes('bike') && (
                    <div className="w-6 h-6 rounded bg-accent/10 flex items-center justify-center">
                      <Bike className="w-3.5 h-3.5 text-accent" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  {lot.amenities.slice(0, 3).map((amenity) => (
                    <span
                      key={amenity}
                      className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
                {lot.availability ? (
                  <span className="text-sm text-success font-medium">
                    {lot.availableSlots} spots left
                  </span>
                ) : (
                  <span className="text-sm text-destructive font-medium">Full</span>
                )}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="p-4">
          <p className="text-sm text-muted-foreground mb-4">
            {filteredLots.length} parking spots found
          </p>
          <RealMapView lots={filteredLots} onSelectLot={handleSelectLot} />
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
