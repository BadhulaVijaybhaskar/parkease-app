import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { loadUserData, vehicles } = useApp();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Auth callback started...');
        
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession();
        console.log('Session data:', { data, error });
        
        if (error) {
          throw error;
        }
        
        if (data.session?.user) {
          const user = data.session.user;
          console.log('User authenticated:', user);
          
          // Load user data and determine next step
          await loadUserData();
          
          toast.success('Signed in successfully!');
          
          // Use setTimeout to avoid navigation warning
          setTimeout(() => {
            // Navigate to add-vehicle if no vehicles, otherwise home
            navigate('/add-vehicle');
          }, 100);
        } else {
          throw new Error('No user session found');
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        toast.error(`Authentication failed: ${error.message}`);
        setTimeout(() => {
          navigate('/login');
        }, 0);
      }
    };

    // Add a small delay to ensure URL params are processed
    const timer = setTimeout(handleAuthCallback, 100);
    return () => clearTimeout(timer);
  }, [navigate, loadUserData]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;