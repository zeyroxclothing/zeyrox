import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const FEATURED_PRODUCTS = [
  {
    id: '1',
    name: 'Oversized Essential Premium Tee',
    price: 35.00,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
    category: 'T-Shirts'
  },
  {
    id: '2',
    name: 'Minimalist Heavyweight Hoodie',
    price: 65.00,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
    category: 'Hoodies'
  },
  {
    id: '3',
    name: 'Relaxed Fit Cargo Pants',
    price: 85.00,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800',
    category: 'Bottoms'
  },
  {
    id: '4',
    name: 'Signature Boxy Crop Top',
    price: 28.00,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800',
    category: 'T-Shirts'
  }
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Top Banner */}
      <div className="primary-gradient text-white text-xs sm:text-sm text-center py-3 font-bold tracking-widest">
        FREE SHIPPING ON ORDERS OVER $100
      </div>

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-50 dark:opacity-50 opacity-30 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#030014] via-transparent to-transparent" />
        </div>
        <div className="relative z-10 text-center text-slate-900 dark:text-white px-6">
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-8xl font-bold tracking-tight mb-8"
          >
            Redefine Your Basic.
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto"
          >
            Premium, minimalist fashion crafted for the modern individual.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link 
              to="/shop" 
              className="inline-flex items-center gap-2 primary-gradient text-white px-8 py-4 font-semibold text-sm rounded-full hover:scale-105 transition-all duration-300"
            >
              Shop Collection <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-between items-end mb-12"
        >
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white drop-shadow-[0_0_8px_rgba(5,17,187,0.1)] dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">New Arrivals</h2>
          <Link to="/shop" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-[#0511bb] dark:hover:text-white transition-all flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {FEATURED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </section>

      {/* Why Choose Us */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="py-24 px-6 relative z-10"
      >
        <motion.div 
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center"
        >
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            className="flex flex-col items-center p-8 glass-panel rounded-3xl hover:-translate-y-2 transition-transform duration-500"
          >
            <div className="w-16 h-16 bg-slate-100 dark:bg-white/10 rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(5,17,187,0.2)] border border-slate-200 dark:border-white/20 mb-6">
              <Truck className="w-8 h-8 text-[#0511bb]" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Fast Worldwide Shipping</h3>
            <p className="text-gray-500 dark:text-gray-400">Free shipping on all orders over $100.</p>
          </motion.div>
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            className="flex flex-col items-center p-8 glass-panel rounded-3xl hover:-translate-y-2 transition-transform duration-500"
          >
            <div className="w-16 h-16 bg-slate-100 dark:bg-white/10 rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(5,17,187,0.2)] border border-slate-200 dark:border-white/20 mb-6">
              <ShieldCheck className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Premium Quality</h3>
            <p className="text-gray-500 dark:text-gray-400">Crafted with the finest, sustainable materials.</p>
          </motion.div>
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            className="flex flex-col items-center p-8 glass-panel rounded-3xl hover:-translate-y-2 transition-transform duration-500"
          >
            <div className="w-16 h-16 bg-slate-100 dark:bg-white/10 rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(5,17,187,0.2)] border border-slate-200 dark:border-white/20 mb-6">
              <RotateCcw className="w-8 h-8 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Easy Returns</h3>
            <p className="text-gray-500 dark:text-gray-400">30-day hassle-free return policy.</p>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Testimonials or Custom Print Callout */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="py-24 px-6 max-w-7xl mx-auto text-center relative z-10 glass-panel rounded-3xl my-24 border border-white/10 shadow-[0_0_50px_rgba(5,17,187,0.1)]"
      >
        <h2 className="text-4xl font-bold tracking-tight mb-6 text-slate-900 dark:text-white drop-shadow-[0_0_8px_rgba(5,17,187,0.1)] dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">Make It Yours</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 text-lg">
          Express yourself with our premium blanks and custom printing service. 
          Upload your design or use our interactive studio.
        </p>
        <Link 
          to="/custom-print" 
          className="inline-flex items-center gap-2 primary-gradient text-white px-8 py-4 font-medium text-sm rounded-full hover:scale-105 transition-all duration-300"
        >
          Start Designing
        </Link>
      </motion.section>
    </div>
  );
}
