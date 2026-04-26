import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setSession, setUser } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await authService.signIn(email, password);
      // @ts-ignore
      setUser(data.user);
      // @ts-ignore
      setSession(data.session);
      toast.success('Successfully logged in');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 relative z-10">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.02)]">
        <h1 className="text-2xl font-bold tracking-tight text-center mb-2 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">Welcome Back</h1>
        <p className="text-gray-400 text-center mb-8 text-sm">Please enter your details to sign in.</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="appearance-none w-4 h-4 border border-white/20 rounded-sm bg-white/5 checked:bg-[#0511bb] checked:border-[#0511bb] transition-all cursor-pointer" />
              <span className="text-gray-400 group-hover:text-white transition-colors">Remember me</span>
            </label>
            <a href="#" className="font-medium hover:text-blue-300 text-blue-400 transition-colors">Forgot password?</a>
          </div>

          <Button type="submit" className="w-full h-12 primary-gradient border-none rounded-xl" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-blue-400 hover:text-blue-300 hover:underline transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
