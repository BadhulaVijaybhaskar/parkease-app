import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight, Car, Bike, Plus, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const AddVehiclePage = () => {
  const navigate = useNavigate();
  const { vehicles, addVehicle, removeVehicle, isOtpVerified } = useApp();
  const [vehicleType, setVehicleType] = useState<'car' | 'bike'>('car');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [nickname, setNickname] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Redirect if not verified
  if (!isOtpVerified) {
    navigate('/login');
    return null;
  }

  // Indian vehicle number pattern
  const formatVehicleNumber = (value: string) => {
    return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
  };

  const isValidNumber = /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/.test(vehicleNumber);

  const handleAddVehicle = async () => {
    if (!isValidNumber) {
      toast.error('Please enter a valid vehicle number (e.g., KA01AB1234)');
      return;
    }

    // Check for duplicates
    if (vehicles.some(v => v.number === vehicleNumber)) {
      toast.error('This vehicle is already added');
      return;
    }

    setIsAdding(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    addVehicle({
      type: vehicleType,
      number: vehicleNumber,
      nickname: nickname || undefined,
    });
    
    setIsAdding(false);
    setVehicleNumber('');
    setNickname('');
    toast.success('Vehicle added successfully!');
  };

  const handleContinue = () => {
    if (vehicles.length === 0) {
      toast.error('Please add at least one vehicle to continue');
      return;
    }
    navigate('/location-permission');
  };

  return (
    <div className="min-h-screen flex flex-col p-6 page-transition">
      {/* Header */}
      <button
        onClick={() => navigate('/otp')}
        className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-8 hover:bg-secondary/80 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 text-secondary-foreground" />
      </button>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Add Your Vehicle
          </h1>
          <p className="text-muted-foreground">
            Add at least one vehicle to start booking
          </p>
        </div>

        {/* Vehicle Type Selection */}
        <div className="mb-6">
          <label className="text-sm font-medium text-foreground mb-3 block">
            Vehicle Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { type: 'car' as const, label: 'Car', icon: Car },
              { type: 'bike' as const, label: 'Bike', icon: Bike },
            ].map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => setVehicleType(type)}
                className={cn(
                  'flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all',
                  vehicleType === type
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                )}
              >
                <Icon className="w-6 h-6" />
                <span className="font-semibold">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle Number */}
        <div className="mb-4">
          <label className="text-sm font-medium text-foreground mb-2 block">
            Vehicle Number
          </label>
          <Input
            placeholder="KA01AB1234"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(formatVehicleNumber(e.target.value))}
            className="h-14 text-lg font-mono uppercase rounded-2xl border-2 focus:border-primary tracking-wider"
          />
          {vehicleNumber.length > 0 && !isValidNumber && (
            <p className="text-sm text-destructive mt-2">
              Format: KA01AB1234 (State Code + District + Letters + Number)
            </p>
          )}
        </div>

        {/* Nickname (Optional) */}
        <div className="mb-6">
          <label className="text-sm font-medium text-foreground mb-2 block">
            Nickname <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <Input
            placeholder="e.g., My Swift, Office Bike"
            value={nickname}
            onChange={(e) => setNickname(e.target.value.slice(0, 20))}
            className="h-12 rounded-2xl border-2 focus:border-primary"
          />
        </div>

        {/* Add Button */}
        <Button
          onClick={handleAddVehicle}
          disabled={!isValidNumber || isAdding}
          variant="outline"
          className="h-12 rounded-2xl border-2 border-dashed border-primary/50 text-primary hover:bg-primary/10 disabled:opacity-50 mb-6"
        >
          {isAdding ? (
            <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          ) : (
            <>
              <Plus className="w-5 h-5 mr-2" />
              Add Vehicle
            </>
          )}
        </Button>

        {/* Added Vehicles */}
        {vehicles.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">
              Your Vehicles ({vehicles.length})
            </h3>
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border"
              >
                <div className="flex items-center gap-3">
                  {vehicle.type === 'car' ? (
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Car className="w-5 h-5 text-primary" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Bike className="w-5 h-5 text-accent" />
                    </div>
                  )}
                  <div>
                    <p className="font-mono font-semibold text-foreground tracking-wide">
                      {vehicle.number}
                    </p>
                    {vehicle.nickname && (
                      <p className="text-sm text-muted-foreground">{vehicle.nickname}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeVehicle(vehicle.id)}
                  className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center text-destructive hover:bg-destructive/20 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-6">
        <Button
          onClick={handleContinue}
          disabled={vehicles.length === 0}
          size="lg"
          className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 transition-all shadow-glow rounded-2xl disabled:opacity-50 disabled:shadow-none"
        >
          Continue
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        {vehicles.length === 0 && (
          <p className="text-sm text-muted-foreground text-center mt-3">
            Add at least one vehicle to continue
          </p>
        )}
      </div>
    </div>
  );
};

export default AddVehiclePage;
