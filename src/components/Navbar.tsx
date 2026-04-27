import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { useThemeStore } from '../store/themeStore';
import { useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';
import logo from '../assets/logo.png';

export default function Navbar() {
  const { items, openCart } = useCartStore();
  const { theme, toggleTheme } = useThemeStore();
  const queryClient = useQueryClient();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const prefetchProducts = () => {
    queryClient.prefetchQuery({
      queryKey: ['products'],
      queryFn: productService.getProducts,
    });
  };

  const navLinks = [
    { name: 'Shop', path: '/shop' },
    { name: 'Custom Print', path: '/custom-print' },
  ];

  return (
    <>
      <motion.nav
        initial={false}
        animate={{
          backgroundColor: theme === 'dark'
            ? (isScrolled ? 'rgba(3, 0, 28, 0.95)' : 'rgba(3, 0, 28, 0.7)')
            : (isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.7)'),
          borderBottomColor: theme === 'dark'
            ? (isScrolled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)')
            : (isScrolled ? 'rgba(0, 0, 0, 0.08)' : 'rgba(0, 0, 0, 0.04)'),
          backdropFilter: isScrolled ? 'blur(40px)' : 'blur(20px)',
        }}
        className="fixed top-0 left-0 right-0 h-16 z-50 border-b flex items-center justify-between px-6 transition-colors duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors p-1"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="ZEYROX"
              className={`h-8 w-auto transition-all duration-500 ${theme === 'light' ? 'invert' : ''}`}
            />
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-1 p-1 bg-slate-200/50 dark:bg-white/5 backdrop-blur-md rounded-full border border-slate-200 dark:border-white/10 relative shadow-inner">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onMouseEnter={link.path === '/shop' ? prefetchProducts : undefined}
                className={`relative px-6 py-2 text-sm font-semibold rounded-full transition-all duration-300 flex items-center justify-center overflow-hidden group
                  ${isActive
                    ? 'text-white'
                    : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:-translate-y-0.5'
                  }`}
              >
                <span className="relative z-10">{link.name}</span>

                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 primary-gradient shadow-[0_4px_15px_rgba(5,17,187,0.3)]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}

                {!isActive && (
                  <div className="absolute inset-0 bg-slate-100 dark:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full glass-panel hover:scale-110 transition-all duration-300 relative overflow-hidden group"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ y: 20, opacity: 0, rotate: -45 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: -20, opacity: 0, rotate: 45 }}
                transition={{ duration: 0.3 }}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
              </motion.div>
            </AnimatePresence>
          </button>

          <Link to="/dashboard" className="text-slate-500 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
            <User className="w-5 h-5" />
          </Link>
          <button onClick={openCart} className="relative text-slate-500 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
            <ShoppingBag className="w-5 h-5" />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  key="item-count"
                  className="absolute -top-1.5 -right-1.5 bg-[#0511bb] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(5,17,187,0.5)]"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay - Outside Header Container */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/10 dark:bg-black/40 backdrop-blur-md z-[60] md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-full max-w-xs bg-white dark:bg-[#03001c]/70 backdrop-blur-lg border-r border-slate-200 dark:border-white/10 z-[70] p-6 flex flex-col md:hidden shadow-[30px_0_100px_rgba(0,0,0,0.2)]"
            >
              <div className="flex items-center justify-between mb-10">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center">
                  <img src={logo} alt="ZEYROX" className={`h-8 w-auto ${theme === 'light' ? 'invert' : ''}`} />
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full glass-panel"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`px-6 py-4 rounded-2xl text-xl font-bold tracking-tight transition-all duration-300 relative overflow-hidden group
                        ${isActive
                          ? 'text-[#0511bb]'
                          : 'text-slate-900 dark:text-white hover:text-[#0511bb] hover:translate-x-2'
                        }`}
                    >
                      <span className="relative z-10">{link.name}</span>
                      {isActive && (
                        <motion.div
                          layoutId="mobile-active-bg"
                          className="absolute inset-0 bg-[#0511bb]/5 dark:bg-[#0511bb]/10"
                        />
                      )}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#0511bb] rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto pt-10 border-t border-slate-100 dark:border-white/10 flex flex-col gap-4">
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 text-slate-600 dark:text-gray-400 font-medium"
                >
                  <User className="w-6 h-6" /> Account Settings
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
