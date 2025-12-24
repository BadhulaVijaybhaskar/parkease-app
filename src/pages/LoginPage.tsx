import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Phone, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setMobile, isAuthenticated, hasVehicle } = useApp();
  const [mobileNumber, setMobileNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated && hasVehicle) {
    navigate('/home');
    return null;
  }

  const isValidMobile = mobileNumber.length === 10 && /^[6-9]\d{9}$/.test(mobileNumber);

  const handleSendOtp = async () => {
    if (!isValidMobile) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMobile(mobileNumber);
    setIsLoading(false);
    toast.success('OTP sent successfully!');
    navigate('/otp');
  };

  return (
    <div className="min-h-screen flex flex-col p-6 page-transition">
      {/* Header */}
      <button
        onClick={() => navigate('/')}
        className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-8 hover:bg-secondary/80 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 text-secondary-foreground" />
      </button>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back
          </h1>
          <p className="text-muted-foreground">
            Enter your mobile number to continue
          </p>
        </div>

        {/* Phone Input */}
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground">
              <Phone className="w-5 h-5" />
              <span className="font-medium">+91</span>
              <div className="w-px h-6 bg-border" />
            </div>
            <Input
              type="tel"
              placeholder="Enter mobile number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="h-14 pl-28 text-lg rounded-2xl border-2 focus:border-primary transition-colors"
              maxLength={10}
            />
          </div>
          
          {mobileNumber.length > 0 && !isValidMobile && (
            <p className="text-sm text-destructive">
              Enter a valid 10-digit mobile number starting with 6-9
            </p>
          )}
        </div>

        {/* Info */}
        <div className="mt-6 p-4 rounded-2xl bg-secondary/50 border border-border">
          <p className="text-sm text-muted-foreground">
            We'll send you a one-time password to verify your number. Standard SMS rates may apply.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-6">
        <Button
          onClick={handleSendOtp}
          disabled={!isValidMobile || isLoading}
          size="lg"
          className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 transition-all shadow-glow rounded-2xl disabled:opacity-50 disabled:shadow-none"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <>
              Send OTP
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
