import { useEffect } from 'react';
import { X } from 'lucide-react';

const Toast = ({ message, type = 'error', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border border-white/10 ${bgColor} text-white animate-in slide-in-from-right`}>
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="hover:opacity-75">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
