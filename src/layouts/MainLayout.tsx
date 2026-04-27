import { useLocation, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import PageTransition from '../components/PageTransition';

import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';

export default function MainLayout() {
  const location = useLocation();
  const { theme } = useThemeStore();
  const { setSession, setUser } = useAuthStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const restoreSession = async () => {
      const { session } = await authService.getSession();
      if (session) {
        setSession(session);
        setUser(session.user);
      }
    };
    restoreSession();
  }, []);

  return (
    <div className={`flex flex-col min-h-screen relative transition-colors duration-300 ${theme === 'dark' ? 'text-gray-100' : 'text-slate-900'}`}>
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-indigo-200 dark:bg-[#0511bb] rounded-full mix-blend-multiply dark:mix-blend-screen transition-all duration-1000 filter blur-[120px] animate-blob"
          style={{ opacity: theme === 'dark' ? 0.2 : 0.4 }}
        ></div>
        <div 
          className="absolute top-[20%] right-[-10%] w-[45rem] h-[45rem] bg-blue-100 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen transition-all duration-1000 filter blur-[120px] animate-blob animation-delay-2000"
          style={{ opacity: theme === 'dark' ? 0.15 : 0.3 }}
        ></div>
        <div 
          className="absolute bottom-[-20%] left-[20%] w-[55rem] h-[55rem] bg-sky-100 dark:bg-indigo-600 rounded-full mix-blend-multiply dark:mix-blend-screen transition-all duration-1000 filter blur-[120px] animate-blob animation-delay-4000"
          style={{ opacity: theme === 'dark' ? 0.1 : 0.25 }}
        ></div>
        {/* Subtle Noise Texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay dark:opacity-[0.02]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}></div>
      </div>

      <Navbar />
      <CartDrawer />
      <main className="flex-grow pt-16 relative">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
