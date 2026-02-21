import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { supabase } from '../utils/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (authError) {
      setError(authError.message);
    } else {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: 'google', 
      options: { 
        redirectTo: window.location.origin, 
        queryParams: { prompt: 'select_account' } 
      } 
    });
    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-24">
        {/* Modal Style Login */}
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <form className="bg-white p-8 rounded-2xl shadow-xl w-96 relative" onSubmit={handleLogin}>
            <h2 className="text-3xl font-bold mb-6 text-blue-600 text-center">Sign In</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full mb-4 px-4 py-2 border rounded"
              required
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword('12345')}
              className="w-full mb-4 px-4 py-2 border rounded"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={async () => {
                const { error } = await supabase.auth.signInWithOAuth({ 
                  provider: 'google', 
                  options: { 
                    redirectTo: window.location.origin, 
                    queryParams: { prompt: 'select_account' } 
                  } 
                });
                if (error) {
                  setError(error.message);
                }
              }}
              className="w-full mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={loading}
            >
              Continue with Google
            </button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold w-full mb-2" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
            <div className="flex justify-between items-center mt-2">
              <a href="#" className="text-blue-500 text-sm">Forgot Password?</a>
              <a href="#" className="text-gray-500 text-sm">Don’t have an account?</a>
            </div>
            {error && <div className="text-red-600 mt-4 text-center">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
