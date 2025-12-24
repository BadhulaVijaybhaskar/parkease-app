import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  fallback?: string;
  className?: string;
}

const BackButton = ({ fallback = '/results', className = '' }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    console.log('Back button clicked, history length:', window.history.length);
    const hasHistory = window.history.length > 1;
    
    if (hasHistory) {
      console.log('Going back via navigate(-1)');
      navigate(-1);
    } else {
      console.log('Going to fallback:', fallback);
      navigate(fallback);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-all duration-200 active:scale-95 ${className}`}
    >
      <ArrowLeft className="w-5 h-5 text-secondary-foreground" />
    </button>
  );
};

export default BackButton;