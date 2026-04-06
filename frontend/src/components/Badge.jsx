import { cn } from '../lib/utils';

const Badge = ({ type, className }) => {
  const styles = {
    INCOME: 'bg-green-500/10 text-green-400',
    EXPENSE: 'bg-red-500/10 text-red-400',
    ADMIN: 'bg-orange-500/10 text-orange-400',
    ANALYST: 'bg-blue-500/10 text-blue-400',
    VIEWER: 'bg-zinc-500/10 text-zinc-400',
    ACTIVE: 'bg-green-500/10 text-green-400',
    INACTIVE: 'bg-red-500/10 text-red-400',
  };

  return (
    <span className={cn('px-2 py-1 text-xs font-semibold rounded-full inline-block', styles[type] || 'bg-gray-800 text-gray-300', className)}>
      {type}
    </span>
  );
};

export default Badge;
