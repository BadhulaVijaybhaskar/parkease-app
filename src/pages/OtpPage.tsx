import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';
import { SupabaseService } from '@/services/supabase';
import { USE_SUPABASE } from '@/lib/supabase';

const OtpPage = () => {
  const navigate = useNavigate();
  const { mobile, verifyOtp, hasVehicle } = useApp();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if no mobile
  useEffect(() => {
    if (!mobile) {
      navigate('/login');
    }
  }, [mobile, navigate]);

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    pastedData.split('').forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    if (pastedData.length === 6) {
      inputRefs.current[5]?.focus();
    }
  };

  const isValidOtp = otp.every(digit => digit !== '');

  const handleVerify = async () => {
    if (!isValidOtp) return;

    setIsLoading(true);
    
    try {
      if (USE_SUPABASE) {
        const otpCode = otp.join('');
        const { data, error } = await SupabaseService.verifyOtp(mobile, otpCode);
        
        if (error) {
          throw error;
        }
        
        // Upsert user record
        if (data.user) {
          await SupabaseService.upsertUser(data.user);
        }
        
        verifyOtp();
        toast.success('Phone verified successfully!');
      } else {
        // Fallback to mock
        await new Promise(resolve => setTimeout(resolve, 1500));
        verifyOtp();
        toast.success('Phone verified successfully!');
      }
      
      if (hasVehicle) {
        navigate('/home');
      } else {
        navigate('/add-vehicle');
      }
    } catch (error: any) {
      if (error.message?.includes('Invalid token')) {
        toast.error('Incorrect OTP. Please try again.');
      } else if (error.message?.includes('expired')) {
        toast.error('OTP expired. Please request a new one.');
      } else {
        toast.error(error.message || 'Verification failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    toast.success('OTP resent successfully!');
  };

  const maskedMobile = mobile ? `${mobile.slice(0, 2)}****${mobile.slice(-4)}` : '';

  return (
    <div className="min-h-screen flex flex-col p-6 page-transition">
      {/* Header */}
      <button
        onClick={() => navigate('/login')}
        className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-8 hover:bg-secondary/80 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 text-secondary-foreground" />
      </button>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Verify OTP
          </h1>
          <p className="text-muted-foreground">
            Enter the 6-digit code sent to{' '}
            <span className="font-semibold text-foreground">{maskedMobile}</span>
          </p>
        </div>

        {/* OTP Input */}
        <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          ))}
        </div>

        {/* Resend */}
        <div className="text-center">
          <button
            onClick={handleResend}
            disabled={resendTimer > 0}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
          </button>
        </div>

        {/* Demo hint */}
        <div className="mt-8 p-4 rounded-2xl bg-accent/10 border border-accent/20">
          <p className="text-sm text-accent text-center font-medium">
            Demo Mode: Enter any 6 digits to continue
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-6">
        <Button
          onClick={handleVerify}
          disabled={!isValidOtp || isLoading}
          size="lg"
          className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 transition-all shadow-glow rounded-2xl disabled:opacity-50 disabled:shadow-none"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <>
              Verify & Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default OtpPage;
