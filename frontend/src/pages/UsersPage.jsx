import { useState, useEffect } from 'react';
import { getUsers, updateRole, updateStatus, deleteUser } from '../api/usersApi';
import Badge from '../components/Badge';
import Spinner from '../components/Spinner';
import Toast from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import { Trash2 } from 'lucide-react';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setToast({ message: 'Failed to fetch users', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    try {
      await updateRole(id, newRole);
      setToast({ message: 'Role updated successfully', type: 'success' });
      fetchUsers();
    } catch (err) {
      setToast({ message: 'Failed to update role', type: 'error' });
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateStatus(id, newStatus);
      setToast({ message: 'Status updated successfully', type: 'success' });
      fetchUsers();
    } catch (err) {
      setToast({ message: 'Failed to update status', type: 'error' });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(deleteModal.id);
      setToast({ message: 'User deleted successfully', type: 'success' });
      fetchUsers();
    } catch (err) {
      setToast({ message: 'Failed to delete user', type: 'error' });
    } finally {
      setDeleteModal({ isOpen: false, id: null });
    }
  };

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmModal 
        isOpen={deleteModal.isOpen} 
        title="Delete User" 
        message="Are you sure you want to delete this user? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ isOpen: false, id: null })}
      />

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-display font-bold">User Management</h2>
        <div className="bg-orange-500/10 text-orange-400 font-semibold px-4 py-2 rounded-full text-sm flex items-center gap-2 border border-orange-500/20">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
          {users.length} Registered Users
        </div>
      </div>

      <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl overflow-hidden">
        {loading ? (
          <Spinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0a0a0a] text-gray-400 uppercase font-medium text-xs">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{u.name}</td>
                    <td className="px-6 py-4 text-gray-400">{u.email}</td>
                    <td className="px-6 py-4">
                      <select 
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="bg-[#1a1a1a] border border-[#2a2a2a] rounded text-sm px-2 py-1 text-white focus:outline-none focus:border-orange-500"
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="ANALYST">ANALYST</option>
                        <option value="VIEWER">VIEWER</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={u.status}
                        onChange={(e) => handleStatusChange(u.id, e.target.value)}
                        className={`bg-[#1a1a1a] border border-[#2a2a2a] rounded text-sm px-2 py-1 focus:outline-none focus:border-orange-500 ${u.status === 'ACTIVE' ? 'text-green-400' : 'text-red-400'}`}
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.role !== 'ADMIN' && (
                        <button 
                          onClick={() => setDeleteModal({ isOpen: true, id: u.id })}
                          className="inline-flex p-2 text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition" 
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
