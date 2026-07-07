import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLoginMutation } from '../redux/api/authApi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const userData = localStorage.getItem('user_data');
    if (token || userData) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await login({ email, password }).unwrap();
      console.log('Login API Response:', response);

      // Aggressively search for the token in common response structures
      const token =
        response.token ||
        response.data?.token ||
        response.accessToken ||
        response.data?.accessToken ||
        response.access_token ||
        response.data?.access_token;

      if (token) {
        localStorage.setItem('admin_token', token);
        console.log(token);
        
      } else {
        console.warn('Could not find a token in the login response!', response);
      }

      localStorage.setItem('user_data', JSON.stringify(response));

      // Force navigation
      navigate('/dashboard');
      toast.success("Successfully logged in!");
    } catch (err) {
      console.error('Login error:', err);
      const errorMsg = err?.data?.message || 'Login failed. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-[#2c2c2c] flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 overflow-hidden">

        {/* Decorative corner blobs */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-100 rounded-br-full opacity-50 mix-blend-multiply filter blur-lg -translate-x-10 -translate-y-10"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-bl-full opacity-50 mix-blend-multiply filter blur-lg translate-x-10 -translate-y-10"></div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Logo */}
          <div className="mb-6">
            <img src="/Logo/Logo.svg" alt="Aapla Grahak Logo" className="h-20 object-contain" />
          </div>

          <h1 className="text-2xl font-bold text-[#0A192F] mb-1">Welcome Back !!</h1>
          <p className="text-gray-600 mb-6 text-sm">Login to your account to continue</p>
          {error && (
            <div className="w-full bg-red-100 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm font-semibold">
              {error}
            </div>
          )}

          {/* Tabs */}
          <div className="flex w-full bg-slate-50 p-1 rounded-xl mb-6">
            <button className="flex-1 bg-[#0A192F] text-white py-2 rounded-lg font-bold text-sm transition-colors">
              Login
            </button>
            <button className="flex-1 text-gray-500 py-2 rounded-lg font-bold text-sm transition-colors hover:text-gray-700">
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="w-full space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-gray-900">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-gray-900">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
              />
            </div>

            <div className="text-right">
              <a href="#" className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 flex items-center justify-center text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-500/30 transition-all active:scale-[0.98] ${isLoading ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
                }`}
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
