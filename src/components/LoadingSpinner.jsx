import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ fullScreen = false, className = '' }) {
  return (
    <div 
      className={`flex items-center justify-center ${fullScreen ? 'min-h-screen' : 'py-16'} ${className}`}
      aria-live="polite"
      aria-busy="true"
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
