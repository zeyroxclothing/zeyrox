import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';
import logo from '../assets/logo.png';

export default function Footer() {
  const { theme } = useThemeStore();
  return (
    <footer className="glass-panel border-t border-slate-200 dark:border-white/10 py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start tracking-tight">
          <Link to="/">
            <img 
              src={logo} 
              alt="ZEYROX" 
              className={`h-10 w-auto mb-4 opacity-90 hover:opacity-100 transition-all dropdown-shadow-sm ${theme === 'light' ? 'invert' : ''}`} 
            />
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400">Premium custom minimalist fashion.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
          <Link to="/shop" className="hover:text-slate-900 dark:hover:text-white transition-colors duration-300">Shop</Link>
          <Link to="/custom-print" className="hover:text-slate-900 dark:hover:text-white transition-colors duration-300">Studio</Link>
          <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors duration-300">Privacy</a>
          <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors duration-300">Terms</a>
        </div>
      </div>
    </footer>
  );
}
