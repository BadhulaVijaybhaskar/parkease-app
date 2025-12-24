import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface HoldTimerProps {
  expiresAt: number;
  slotLabel: string;
  onExpire: () => void;
}

const HoldTimer = ({ expiresAt, slotLabel, onExpire }: HoldTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, expiresAt - now);
      
      if (remaining === 0) {
        onExpire();
        clearInterval(interval);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className="bg-warning/10 border border-warning/30 rounded-xl p-3 mb-4">
      <div className="flex items-center gap-2 text-warning">
        <Clock className="w-4 h-4" />
        <span className="text-sm font-medium">
          Holding slot <span className="font-bold">{slotLabel}</span> for{' '}
          <span className="font-mono">
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </span>
        </span>
      </div>
    </div>
  );
};

export default HoldTimer;