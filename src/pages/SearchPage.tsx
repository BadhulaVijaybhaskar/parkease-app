import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, MapPin, Clock, Calendar } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { format, addHours, setHours, setMinutes } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const SearchPage = () => {
  const navigate = useNavigate();
  const { setCurrentBookingTime, isAuthenticated, hasVehicle } = useApp();
  
  const [location, setLocation] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: new Date(), to: undefined });
  
  // Set default times to next available slots
  const getNextAvailableTime = (hoursFromNow: number) => {
    const nextTime = addHours(new Date(), hoursFromNow);
    const hour = nextTime.getHours();
    const minute = nextTime.getMinutes() >= 30 ? 30 : 0;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };
  
  const [startTime, setStartTime] = useState(getNextAvailableTime(1));
  const [endTime, setEndTime] = useState(getNextAvailableTime(3));

  // Redirect if not authenticated
  if (!isAuthenticated || !hasVehicle) {
    navigate('/');
    return null;
  }

  const handleSearch = () => {
    if (!location.trim()) {
      toast.error('Please enter a location');
      return;
    }

    const selectedDate = dateRange.from || date;
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    const startDateTime = setMinutes(setHours(selectedDate, startHour), startMin);
    let endDateTime = setMinutes(setHours(selectedDate, endHour), endMin);

    // If end time is before start time, assume next day
    if (endDateTime <= startDateTime) {
      endDateTime = addHours(endDateTime, 24);
    }

    if (endDateTime <= startDateTime) {
      toast.error('End time must be after start time');
      return;
    }

    setCurrentBookingTime(startDateTime, endDateTime);
    navigate('/results');
  };

  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  // Filter time slots based on selected date
  const getAvailableTimeSlots = () => {
    const now = new Date();
    const selectedDate = dateRange.from || date;
    const isToday = selectedDate?.toDateString() === now.toDateString();
    
    if (!isToday) {
      return timeSlots; // Show all slots for future dates
    }
    
    // For today, only show future time slots
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    return timeSlots.filter(time => {
      const [hour, minute] = time.split(':').map(Number);
      const slotTime = hour * 60 + minute;
      const currentTime = currentHour * 60 + currentMinute;
      return slotTime > currentTime;
    });
  };

  const availableTimeSlots = getAvailableTimeSlots();

  return (
    <div className="min-h-screen flex flex-col bg-background page-transition">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/home')}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-secondary-foreground" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Search Parking</h1>
        </div>

        {/* Search Form */}
        <div className="space-y-4">
          {/* Location */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Enter area, landmark, or address"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-14 pl-12 text-lg rounded-2xl border-2 focus:border-primary"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-14 justify-start text-left font-normal rounded-2xl border-2",
                    !date && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-3 h-5 w-5" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d")}`
                    ) : (
                      format(dateRange.from, "EEEE, MMMM d")
                    )
                  ) : (
                    "Select date(s)"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => {
                    setDateRange(range || { from: undefined, to: undefined });
                    // Also update single date for backward compatibility
                    if (range?.from) {
                      setDate(range.from);
                    }
                  }}
                  disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Start Time
              </label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 text-lg rounded-2xl border-2 border-input bg-background appearance-none focus:border-primary outline-none"
                >
                  {availableTimeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                End Time
              </label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 text-lg rounded-2xl border-2 border-input bg-background appearance-none focus:border-primary outline-none"
                >
                  {availableTimeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="pt-4">
            <p className="text-sm font-medium text-muted-foreground mb-3">Popular Searches</p>
            <div className="flex flex-wrap gap-2">
              {['MG Road', 'Brigade Road', 'Koramangala', 'Indiranagar', 'Whitefield'].map((place) => (
                <button
                  key={place}
                  onClick={() => setLocation(place)}
                  className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {place}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto p-6">
        <Button
          onClick={handleSearch}
          disabled={!location.trim()}
          size="lg"
          className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 transition-all shadow-glow rounded-2xl disabled:opacity-50 disabled:shadow-none"
        >
          <Search className="w-5 h-5 mr-2" />
          Search Parking
        </Button>
      </div>
    </div>
  );
};

export default SearchPage;
