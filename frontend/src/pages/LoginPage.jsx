import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../api/authApi';
import Toast from '../components/Toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await loginApi(email, password);
      login(data.token, { name: data.name, email, role: data.role });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0a0a0a] text-white">
      {error && <Toast message={error} onClose={() => setError(null)} />}
      
      {/* Left side */}
      <div className="p-8 md:w-1/2 flex flex-col justify-center items-start border-b md:border-b-0 md:border-r border-[#2a2a2a]">
        <div className="max-w-lg mx-auto w-full px-4">
          <h1 className="text-5xl md:text-6xl font-bold font-display mb-6">
            <span className="text-gradient">Finance</span> Dashboard
          </h1>
          <p className="text-xl text-gray-400 mb-12">Manage your financial records with precision, built for scale and speed.</p>
          
          <div className="bg-[#111111] border border-[#2a2a2a] p-6 rounded-2xl">
            <h3 className="text-sm font-semibold tracking-[0.2em] uppercase text-orange-400 border border-orange-500/30 rounded-full px-4 py-1 inline-block mb-4">Demo Credentials</h3>
            <ul className="space-y-3 text-sm flex flex-col">
              <li className="flex justify-between items-center pb-2 border-b border-[#2a2a2a]">
                <span className="text-gray-400">Admin:</span> 
                <span className="font-mono bg-[#1a1a1a] px-2 py-1 flex rounded">admin@finance.com / admin123</span>
              </li>
              <li className="flex justify-between items-center pb-2 border-b border-[#2a2a2a]">
                <span className="text-gray-400">Analyst:</span> 
                <span className="font-mono bg-[#1a1a1a] px-2 py-1 rounded">analyst@finance.com / analyst123</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-400">Viewer:</span> 
                <span className="font-mono bg-[#1a1a1a] px-2 py-1 rounded">viewer@finance.com / viewer123</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right side form */}
      <div className="p-8 md:w-1/2 flex flex-col justify-center items-center">
        <div className="w-full max-w-md bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 font-display">Sign In</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-400 text-black font-semibold rounded-full px-6 py-3 mt-4 hover:scale-[1.02] transition-transform flex justify-center disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
