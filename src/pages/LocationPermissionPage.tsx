import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, SkipForward } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';

const LocationPermissionPage = () => {
  const navigate = useNavigate();
  const { setLocationGranted, hasVehicle, isOtpVerified } = useApp();

  // Redirect if not ready
  if (!isOtpVerified || !hasVehicle) {
    navigate('/add-vehicle');
    return null;
  }

  const handleAllowLocation = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      
      if (result.state === 'granted') {
        setLocationGranted(true);
        toast.success('Location access enabled!');
        navigate('/home');
      } else if (result.state === 'prompt') {
        navigator.geolocation.getCurrentPosition(
          () => {
            setLocationGranted(true);
            toast.success('Location access enabled!');
            navigate('/home');
          },
          () => {
            toast.error('Location access denied. You can still search manually.');
            navigate('/home');
          }
        );
      } else {
        toast.error('Location access blocked. Please enable in browser settings.');
        navigate('/home');
      }
    } catch {
      // Fallback for browsers that don't support permissions API
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationGranted(true);
          toast.success('Location access enabled!');
          navigate('/home');
        },
        () => {
          toast.error('Location access denied');
          navigate('/home');
        }
      );
    }
  };

  const handleSkip = () => {
    setLocationGranted(false);
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col p-6 page-transition">
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* Icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-primary" />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full gradient-accent flex items-center justify-center shadow-accent-glow animate-pulse-glow">
            <Navigation className="w-6 h-6 text-accent-foreground" />
          </div>
        </div>

        {/* Text */}
        <h1 className="text-3xl font-bold text-foreground mb-3">
          Enable Location
        </h1>
        <p className="text-muted-foreground text-lg mb-2 max-w-xs">
          Allow location access to find parking spots near you
        </p>
        <p className="text-sm text-muted-foreground/70 max-w-xs">
          We use your location only to show nearby parking lots. You can always search manually.
        </p>
      </div>

      {/* Buttons */}
      <div className="space-y-3 pt-6">
        <Button
          onClick={handleAllowLocation}
          size="lg"
          className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 transition-all shadow-glow rounded-2xl"
        >
          <MapPin className="w-5 h-5 mr-2" />
          Allow Location Access
        </Button>
        
        <Button
          onClick={handleSkip}
          variant="ghost"
          size="lg"
          className="w-full h-12 text-muted-foreground hover:text-foreground"
        >
          <SkipForward className="w-5 h-5 mr-2" />
          Skip for now
        </Button>
      </div>
    </div>
  );
};

export default LocationPermissionPage;
