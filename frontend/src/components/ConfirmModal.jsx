const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
        <h3 className="text-xl font-bold mb-2 font-display">{title}</h3>
        <p className="text-gray-400 mb-6 text-sm">{message}</p>
        <div className="flex justify-end gap-3">
          <button 
            onClick={onCancel}
            className="px-4 py-2 border border-[#2a2a2a] hover:bg-[#1a1a1a] rounded-xl text-sm font-medium transition"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
