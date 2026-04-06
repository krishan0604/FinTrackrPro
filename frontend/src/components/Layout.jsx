import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Receipt, Users, LogOut, Menu, X, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import Badge from './Badge';

const Layout = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/eic-dashboard', label: 'EIC Stats', icon: BarChart3 },
    { to: '/records', label: 'Records', icon: Receipt },
  ];

  if (hasRole('ADMIN')) {
    navLinks.push({ to: '/users', label: 'Users', icon: Users });
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-[#111111] border-r border-[#2a2a2a] transition-transform duration-300 md:relative md:translate-x-0 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col`}>
        
        {/* Top Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#2a2a2a]">
          <h1 className="text-2xl font-bold font-display text-gradient">KK Finance</h1>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-orange-500/10 text-orange-400 border-l-4 border-orange-500' 
                  : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
              }`}
            >
              <link.icon size={20} />
              <span className="font-medium">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom User Profile */}
        <div className="p-4 border-t border-[#2a2a2a]">
          <div className="flex flex-col gap-3 bg-[#1a1a1a] p-3 rounded-xl border border-[#2a2a2a]">
            <div>
              <p className="text-sm font-semibold truncate text-white">{user?.name}</p>
              <Badge type={user?.role} className="mt-1" />
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 flex items-center px-6 bg-[#111111]/50 backdrop-blur border-b border-[#2a2a2a] md:hidden">
          <button className="text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold font-display text-gradient ml-4">KK Finance</h1>
        </header>
        
        <div className="flex-1 p-6 md:p-8 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
