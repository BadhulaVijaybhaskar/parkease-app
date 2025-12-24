import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Car, Bike, Plus, X, LogOut, Clock, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { mobile, vehicles, removeVehicle, logout, bookings, isAuthenticated } = useApp();

  if (!isAuthenticated) { navigate('/'); return null; }

  const handleLogout = () => { logout(); toast.success('Logged out'); navigate('/'); };

  return (
    <div className="min-h-screen bg-background page-transition">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/home')} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        </div>

        <div className="flex items-center gap-4 p-4 bg-card rounded-2xl border border-border mb-6">
          <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center"><User className="w-7 h-7 text-primary-foreground" /></div>
          <div><p className="font-semibold text-foreground">+91 {mobile}</p><p className="text-sm text-muted-foreground">{bookings.length} bookings</p></div>
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
