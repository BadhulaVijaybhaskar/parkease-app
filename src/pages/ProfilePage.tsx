import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Car, Bike, Plus, X, LogOut, Clock, User, Mail, Phone } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { mobile, vehicles, removeVehicle, logout, bookings, isAuthenticated, supabaseUser } = useApp();

  if (!isAuthenticated) { navigate('/'); return null; }

  const handleLogout = () => { logout(); toast.success('Logged out'); navigate('/'); };

  // Get user info from Supabase user or fallback
  const userName = supabaseUser?.user_metadata?.full_name || supabaseUser?.user_metadata?.name || 'User';
  const userEmail = supabaseUser?.email || '';
  const userPhone = mobile || supabaseUser?.user_metadata?.phone || '';

  return (
    <div className="min-h-screen bg-background page-transition">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/home')} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        </div>

        {/* User Profile Card */}
        <div className="p-6 bg-card rounded-2xl border border-border mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">{userName}</h2>
              <p className="text-sm text-muted-foreground">{bookings.length} bookings</p>
            </div>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{userEmail}</p>
              </div>
            </div>
            
            {userPhone && (
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">+91 {userPhone}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-3"><h2 className="font-semibold text-foreground">My Vehicles</h2><Button onClick={() => navigate('/add-vehicle')} variant="ghost" size="sm"><Plus className="w-4 h-4 mr-1" />Add</Button></div>
          <div className="space-y-2">
            {vehicles.map((v) => (
              <div key={v.id} className="flex items-center justify-between p-3 bg-card rounded-xl border border-border">
                <div className="flex items-center gap-3">
                  {v.type === 'car' ? <Car className="w-5 h-5 text-primary" /> : <Bike className="w-5 h-5 text-accent" />}
                  <div><p className="font-mono font-semibold">{v.number}</p>{v.nickname && <p className="text-xs text-muted-foreground">{v.nickname}</p>}</div>
                </div>
                {vehicles.length > 1 && <button onClick={() => removeVehicle(v.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-full"><X className="w-4 h-4" /></button>}
              </div>
            ))}
          </div>
        </div>

        <Button onClick={() => navigate('/booking/history')} variant="outline" className="w-full h-12 rounded-xl mb-3 justify-start"><Clock className="w-5 h-5 mr-3" />Booking History</Button>
        <Button onClick={handleLogout} variant="ghost" className="w-full h-12 rounded-xl text-destructive hover:bg-destructive/10 justify-start"><LogOut className="w-5 h-5 mr-3" />Logout</Button>
      </div>
    </div>
  );
};

export default ProfilePage;
