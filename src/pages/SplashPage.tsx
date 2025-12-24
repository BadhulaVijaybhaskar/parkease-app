import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Car, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useEffect } from 'react';

const SplashPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isOtpVerified, hasVehicle } = useApp();

  useEffect(() => {
    // Auto-redirect if already authenticated
    if (isAuthenticated && hasVehicle) {
      navigate('/home');
    }
  }, [isAuthenticated, hasVehicle, navigate]);

  const handleContinue = () => {
    if (isAuthenticated && hasVehicle) {
      navigate('/home');
    } else if (isOtpVerified && !hasVehicle) {
      navigate('/add-vehicle');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gradient-hero page-transition">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-40 h-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-60 h-60 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
        {/* Logo */}
        <div className="relative mb-8">
          <div className="w-28 h-28 rounded-3xl gradient-primary flex items-center justify-center shadow-glow animate-float">
            <Car className="w-14 h-14 text-primary-foreground" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-accent-glow">
            <Sparkles className="w-4 h-4 text-accent-foreground" />
          </div>
        </div>

        {/* Brand */}
        <h1 className="text-4xl font-bold mb-2 tracking-tight">
          <span className="text-gradient">Park</span>
          <span className="text-foreground">Ease</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-2">
          Smart Parking, Simple Life
        </p>
        <p className="text-sm text-muted-foreground/70 mb-12">
          Find, reserve & park in seconds
        </p>

        {/* Features */}
        <div className="flex gap-6 mb-12">
          {['Book Ahead', 'QR Entry', 'No Cash'].map((feature) => (
            <div key={feature} className="flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-primary mb-2" />
              <span className="text-xs text-muted-foreground font-medium">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Button
          onClick={handleContinue}
          size="lg"
          className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 transition-all shadow-glow rounded-2xl"
        >
          Get Started
        </Button>

        <p className="text-xs text-muted-foreground/60 mt-4">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default SplashPage;
