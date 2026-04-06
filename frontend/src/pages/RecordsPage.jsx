import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getRecords, deleteRecord } from '../api/recordsApi';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, Edit2, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import Badge from '../components/Badge';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';

const RecordsPage = () => {
  const { hasRole } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  
  // Filters
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    startDate: '',
    endDate: '',
    page: 0,
    size: 10
  });

  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRecords(filters);
      setRecords(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to fetch records', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, page: 0 }));
  };

  const resetFilters = () => {
    setFilters({ type: '', category: '', startDate: '', endDate: '', page: 0, size: 10 });
  };

  const handleDelete = async () => {
    try {
      await deleteRecord(deleteModal.id);
      setToast({ message: 'Record deleted successfully', type: 'success' });
      fetchRecords();
    } catch (err) {
      setToast({ message: 'Failed to delete record', type: 'error' });
    } finally {
      setDeleteModal({ isOpen: false, id: null });
    }
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmModal 
        isOpen={deleteModal.isOpen} 
        title="Delete Record" 
        message="Are you sure you want to delete this financial record? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ isOpen: false, id: null })}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold">Financial Records</h2>
          <p className="text-gray-400 mt-1">Manage all transactions</p>
        </div>
        {hasRole('ADMIN') && (
          <Link 
            to="/records/new" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-400 text-black font-semibold rounded-full px-6 py-2 hover:scale-105 transition-transform"
          >
            <Plus size={20} /> Add Record
          </Link>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
              <select name="type" value={filters.type} onChange={handleFilterChange} className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 py-2 text-white text-sm focus:border-orange-500 focus:outline-none">
                <option value="">All</option>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
            </div>
            <div className="w-full">
              <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
              <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 py-2 text-white text-sm focus:border-orange-500 focus:outline-none" />
            </div>
            <div className="w-full">
              <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
              <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 py-2 text-white text-sm focus:border-orange-500 focus:outline-none" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchRecords} className="border border-orange-500 text-orange-400 rounded-full px-6 py-2 text-sm font-medium hover:bg-orange-500/10 transition flex items-center gap-2">
              <Filter size={16} /> Apply
            </button>
            <button onClick={resetFilters} className="text-gray-400 hover:text-white px-4 py-2 text-sm font-medium transition">
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl overflow-hidden">
        {loading ? (
          <Spinner />
        ) : records.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#0a0a0a] text-gray-400 uppercase font-medium text-xs">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Description</th>
                    {hasRole('ADMIN') && <th className="px-6 py-4 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a2a]">
                  {records.map(record => (
                    <tr key={record.id} className="hover:bg-[#1a1a1a] transition-colors">
                      <td className="px-6 py-4 text-gray-300">{record.date}</td>
                      <td className="px-6 py-4 text-gray-300">{record.category}</td>
                      <td className="px-6 py-4"><Badge type={record.type} /></td>
                      <td className={`px-6 py-4 font-semibold ${record.type === 'INCOME' ? 'text-green-400' : 'text-red-400'}`}>
                        {record.type === 'INCOME' ? '+' : '-'}{formatCurrency(record.amount)}
                      </td>
                      <td className="px-6 py-4 text-gray-400 max-w-xs xl:max-w-md truncate">{record.description}</td>
                      {hasRole('ADMIN') && (
                        <td className="px-6 py-4 text-right space-x-2">
                          <Link to={`/records/${record.id}/edit`} className="inline-flex p-2 text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 rounded-lg transition" title="Edit">
                            <Edit2 size={16} />
                          </Link>
                          <button 
                            onClick={() => setDeleteModal({ isOpen: true, id: record.id })}
                            className="inline-flex p-2 text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition" 
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Box */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-[#2a2a2a] flex items-center justify-between">
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, page: Math.max(0, prev.page - 1) }))} 
                  disabled={filters.page === 0}
                  className="px-4 py-2 border border-[#2a2a2a] rounded-xl text-sm font-medium hover:bg-[#1a1a1a] transition disabled:opacity-50 flex items-center gap-1 text-gray-300"
                >
                  <ArrowLeft size={16} /> Prev
                </button>
                <span className="text-gray-400 text-sm">Page {filters.page + 1} of {totalPages}</span>
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, page: Math.min(totalPages - 1, prev.page + 1) }))} 
                  disabled={filters.page === totalPages - 1}
                  className="px-4 py-2 border border-[#2a2a2a] rounded-xl text-sm font-medium hover:bg-[#1a1a1a] transition disabled:opacity-50 flex items-center gap-1 text-gray-300"
                >
                  Next <ArrowRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          <EmptyState message="No records found with applied filters." />
        )}
      </div>
    </div>
  );
};

export default RecordsPage;
