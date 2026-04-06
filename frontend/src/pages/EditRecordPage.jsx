import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { updateRecord, getRecordById } from '../api/recordsApi';
import Toast from '../components/Toast';
import Spinner from '../components/Spinner';

const CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Rent', 'Utilities', 'Food', 'Travel', 'Marketing', 'Other'];

const EditRecordPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    type: 'INCOME',
    category: 'Salary',
    date: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const record = await getRecordById(id);
        setFormData({
          amount: record.amount,
          type: record.type,
          category: record.category,
          date: record.date,
          description: record.description || ''
        });
      } catch (err) {
        setToast({ message: 'Failed to fetch record details.', type: 'error' });
      } finally {
        setFetching(false);
      }
    };
    fetchRecord();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateRecord(id, {
        ...formData,
        amount: parseFloat(formData.amount)
      });
      setToast({ message: 'Record updated successfully!', type: 'success' });
      setTimeout(() => navigate('/records'), 1500);
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to update record.', type: 'error' });
      setLoading(false);
    }
  };

  if (fetching) return <Spinner />;

  return (
    <div className="max-w-2xl mx-auto py-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8 shadow-xl">
        <h2 className="text-3xl font-display font-bold mb-8">
          Edit <span className="text-gradient">Record</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Amount (₹)</label>
              <input 
                type="number" 
                step="0.01"
                min="0.01"
                required
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
              <input 
                type="date" 
                required
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
              <select 
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
              >
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Description (Optional)</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition resize-none"
              placeholder="Add details about this record..."
            ></textarea>
          </div>

          <div className="flex border-t border-[#2a2a2a] pt-6 gap-4">
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-orange-500 to-amber-400 text-black font-semibold rounded-xl px-6 py-3 hover:scale-[1.02] transition-transform disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? 'Updating...' : 'Update Record'}
            </button>
            <Link 
              to="/records"
              className="flex-1 text-center border border-[#2a2a2a] rounded-xl px-6 py-3 hover:bg-[#1a1a1a] transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRecordPage;
