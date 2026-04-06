import { Info } from 'lucide-react';

const EmptyState = ({ message = "No data found." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500 border border-dashed border-[#2a2a2a] rounded-2xl">
      <Info size={40} className="mb-4 text-gray-600" />
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default EmptyState;
