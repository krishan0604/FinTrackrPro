import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RecordsPage from './pages/RecordsPage';
import AddRecordPage from './pages/AddRecordPage';
import EditRecordPage from './pages/EditRecordPage';
import UsersPage from './pages/UsersPage';
import EicDashboardPage from './pages/EicDashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
        
        <Route path="/eic-dashboard" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute><EicDashboardPage /></ProtectedRoute>} />
        
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/records" element={<RecordsPage />} />
          
          <Route element={<RoleProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/records/new" element={<AddRecordPage />} />
            <Route path="/records/:id/edit" element={<EditRecordPage />} />
            <Route path="/users" element={<UsersPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
