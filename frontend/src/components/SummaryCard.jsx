const SummaryCard = ({ title, value, icon: Icon, colorClass, subtext }) => {
  return (
    <div className="bg-[#111111] rounded-2xl border border-[#2a2a2a] p-6 flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-400 font-medium text-sm">{title}</h3>
        <div className={`p-2 rounded-lg bg-opacity-10 ${colorClass.replace('text-', 'bg-')}`}>
          <Icon className={colorClass} size={20} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold font-display">{value}</p>
        {subtext && <p className="text-xs text-gray-500 mt-2">{subtext}</p>}
      </div>
    </div>
  );
};

export default SummaryCard;
