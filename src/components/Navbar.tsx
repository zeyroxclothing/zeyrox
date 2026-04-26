import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { useThemeStore } from '../store/themeStore';
import logo from '../assets/logo.png';

export default function Navbar() {
  const { items, openCart } = useCartStore();
  const { theme, toggleTheme } = useThemeStore();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Shop', path: '/shop' },
    { name: 'Custom Print', path: '/custom-print' },
  ];

  return (
    <motion.nav 
      initial={false}
      animate={{
        backgroundColor: theme === 'dark' 
          ? (isScrolled ? 'rgba(3, 0, 20, 0.8)' : 'rgba(3, 0, 20, 0.4)') 
          : (isScrolled ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.4)'),
        borderBottomColor: theme === 'dark'
          ? (isScrolled ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)')
          : (isScrolled ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.05)'),
        backdropFilter: isScrolled ? 'blur(32px)' : 'blur(16px)',
      }}
      className="fixed top-0 left-0 right-0 h-16 z-50 border-b flex items-center justify-between px-6 transition-colors duration-500 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
    >
      <div className="flex items-center gap-4">
        <button className="md:hidden text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        <Link to="/" className="flex items-center">
          <img 
            src={logo} 
            alt="ZEYROX" 
            className={`h-8 w-auto transition-all duration-500 drop-shadow-[0_2px_10px_rgba(5,17,187,0.1)] dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] ${theme === 'light' ? 'invert' : ''}`} 
          />
        </Link>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
        {navLinks.map((link) => (
          <Link 
            key={link.path}
            to={link.path} 
            className="relative py-1 text-slate-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          >
            {link.name}
            {location.pathname === link.path && (
              <motion.div 
                layoutId="nav-underline"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#0511bb] rounded-full"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        ))}
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

        <Link to="/dashboard" className="text-gray-400 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
          <User className="w-5 h-5" />
        </Link>
        <button onClick={openCart} className="relative text-gray-400 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
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
  );
}
