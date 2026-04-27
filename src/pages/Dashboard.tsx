import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { LogOut, Package, Image as ImageIcon, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import { designService } from '../services/designService';
import { Button } from '../components/ui/Button';

export default function Dashboard() {
  const { user, setUser, setSession, isInitialized } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'designs'>('profile');

  useEffect(() => {
    if (isInitialized && !user) {
      navigate('/login');
    }
  }, [user, navigate, isInitialized]);

  const { data: designs } = useQuery({
    queryKey: ['user-designs', user?.id],
    queryFn: () => designService.getUserDesigns(user!.id),
    enabled: !!user && activeTab === 'designs',
  });

  const handleLogout = async () => {
    await authService.signOut();
    setUser(null);
    setSession(null);
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-8 relative z-10">
      {/* Sidebar */}
      <div className="w-full md:w-64 flex shrink-0 flex-col gap-2">
        <div className="glass-panel p-6 rounded-3xl mb-4 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.02)]">
          <p className="font-medium text-lg text-white">{user.user_metadata?.full_name || 'User'}</p>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-medium transition-all duration-300 ${
            activeTab === 'profile' ? 'primary-gradient text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'text-gray-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          <User className="w-4 h-4" /> Profile
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-medium transition-all duration-300 ${
            activeTab === 'orders' ? 'primary-gradient text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'text-gray-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" /> Orders
        </button>
        <button
          onClick={() => setActiveTab('designs')}
          className={`flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-medium transition-all duration-300 ${
            activeTab === 'designs' ? 'primary-gradient text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'text-gray-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          <ImageIcon className="w-4 h-4" /> Saved Designs
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 border border-red-500/0 hover:border-red-500/20 transition-all mt-auto md:mt-8"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 glass-panel border border-white/10 p-8 rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.02)] min-h-[500px]">
        {activeTab === 'profile' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">Profile Details</h2>
            <div className="max-w-md space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-white">{user.user_metadata?.full_name || 'N/A'}</div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-white">{user.email}</div>
              </div>
            </div>
            <div className="mt-8">
              <Button variant="outline" className="rounded-xl glass-button-secondary">Edit Profile</Button>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">Order History</h2>
            <div className="text-center py-12 text-gray-400 border border-dashed border-white/20 rounded-2xl bg-white/5">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>You haven't placed any orders yet.</p>
              <Button className="mt-6 rounded-xl primary-gradient border-none" onClick={() => navigate('/shop')}>Start Shopping</Button>
            </div>
          </div>
        )}

        {activeTab === 'designs' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">Saved Designs</h2>
            {!designs || designs.length === 0 ? (
              <div className="text-center py-12 text-gray-400 border border-dashed border-white/20 rounded-2xl bg-white/5">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No custom designs saved yet.</p>
                <Button className="mt-6 rounded-xl primary-gradient border-none" onClick={() => navigate('/custom-print')}>Create Design</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {designs.map((design) => (
                  <div key={design.id} className="glass-panel border border-white/10 rounded-2xl overflow-hidden group hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all">
                    <div className="aspect-[3/4] bg-white/5 relative items-center justify-center flex">
                      <img src={design.image_url} alt="Saved design" className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-[#030014]/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="outline" size="sm" className="glass-button-secondary rounded-xl text-white">Order Now</Button>
                      </div>
                    </div>
                    <div className="p-4 border-t border-white/10 bg-white/5">
                      <p className="text-xs text-gray-400">Saved on {design.created_at ? new Date(design.created_at).toLocaleDateString() : 'Recently'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
