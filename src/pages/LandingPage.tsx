import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Search, CreditCard, QrCode, Car, CheckCircle, MapPin, Clock, Shield, Smartphone } from 'lucide-react';
import { useEffect } from 'react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, hasVehicle } = useApp();

  // Redirect authenticated users
  useEffect(() => {
    if (isAuthenticated && hasVehicle) {
      navigate('/home');
    }
  }, [isAuthenticated, hasVehicle, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="gradient-hero px-6 pt-12 pb-16">
        <div className="max-w-md mx-auto text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-16 h-16 mx-auto mb-4 gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
              <Car className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">ParkEase</h1>
          </div>

          {/* Hero Content */}
          <h2 className="text-3xl font-bold text-foreground mb-4 leading-tight">
            Book Parking Before You Reach
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Guaranteed parking slots near your destination. No searching. No cash.
          </p>

          {/* Primary CTA */}
          <Button
            onClick={() => navigate('/login')}
            size="lg"
            className="w-full h-14 text-lg font-semibold gradient-primary shadow-glow rounded-2xl mb-4"
          >
            <Smartphone className="w-5 h-5 mr-2" />
            Continue with Mobile Number
          </Button>

          <p className="text-sm text-muted-foreground">
            Quick signup • No app download required
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="px-6 py-12">
        <div className="max-w-md mx-auto">
          <h3 className="text-xl font-bold text-foreground text-center mb-8">
            How It Works
          </h3>
          
          <div className="space-y-6">
            {[
              {
                icon: Search,
                title: 'Search parking',
                description: 'Find spots near your destination'
              },
              {
                icon: CreditCard,
                title: 'Reserve & pay',
                description: 'Secure your slot online'
              },
              {
                icon: QrCode,
                title: 'Get QR code',
                description: 'Instant booking confirmation'
              },
              {
                icon: Car,
                title: 'Show QR & park',
                description: 'Easy entry, guaranteed spot'
              }
            ].map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="px-6 py-12 bg-secondary/30">
        <div className="max-w-md mx-auto">
          <h3 className="text-xl font-bold text-foreground text-center mb-8">
            Why Use ParkEase?
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                icon: CheckCircle,
                title: 'Guaranteed entry',
                color: 'text-success'
              },
              {
                icon: CreditCard,
                title: 'No cash needed',
                color: 'text-primary'
              },
              {
                icon: Clock,
                title: 'Save time & fuel',
                color: 'text-accent'
              },
              {
                icon: Shield,
                title: 'Verified locations',
                color: 'text-warning'
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center p-4">
                <benefit.icon className={`w-8 h-8 mx-auto mb-2 ${benefit.color}`} />
                <p className="text-sm font-medium text-foreground">{benefit.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="px-6 py-12">
        <div className="max-w-md mx-auto">
          <h3 className="text-xl font-bold text-foreground text-center mb-8">
            Perfect For
          </h3>
          
          <div className="space-y-3">
            {[
              'Office parking',
              'Malls & shopping',
              'Events & stadiums',
              'Travel hubs'
            ].map((useCase, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-foreground">{useCase}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="px-6 py-12 bg-secondary/30">
        <div className="max-w-md mx-auto text-center">
          <h3 className="text-xl font-bold text-foreground mb-6">
            Trusted & Secure
          </h3>
          
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>✓ Verified parking partners</p>
            <p>✓ Secure digital payments</p>
            <p>✓ Vehicle-based booking</p>
            <p>✓ 24/7 support available</p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="px-6 py-8">
        <div className="max-w-md mx-auto">
          <Button
            onClick={() => navigate('/login')}
            size="lg"
            className="w-full h-14 text-lg font-semibold gradient-primary shadow-glow rounded-2xl"
          >
            Get Started – Login with Mobile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;