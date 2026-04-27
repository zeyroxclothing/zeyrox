import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Zap, Mail } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Marquee from '../components/Marquee';

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

const CATEGORIES = [
  { name: 'T-Shirts', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=600', path: '/shop?category=T-Shirts' },
  { name: 'Hoodies', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600', path: '/shop?category=Hoodies' },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600', path: '/shop?category=Accessories' },
];

const MARQUEE_CONTENT = ["LUXURY ESSENTIALS", "ETHICALLY MADE", "CRAFTED FOR QUALITY", "SUSTAINABLE FABRICS", "DESIGNED TO LAST", "ZEYROX • 2026"];

export default function Home() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 200]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Background blobs for premium feel */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-blob animation-delay-2000" />
      </div>

      {/* Top Banner */}
      <div className="relative z-20 primary-gradient text-white text-xs sm:text-sm text-center py-3 font-bold tracking-widest uppercase">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2"
        >
          <Zap className="w-3 h-3 fill-current" />
          Free Shipping on All Orders Over $100
          <Zap className="w-3 h-3 fill-current" />
        </motion.div>
      </div>

      {/* Hero Section */}
      <section className="relative h-[100vh] flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-60 mix-blend-luminosity grayscale hover:grayscale-0 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#020110] via-transparent to-transparent" />
        </motion.div>
        
        <div className="relative z-10 text-center text-slate-900 dark:text-white px-6 max-w-4xl">
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0511bb]/20 bg-[#0511bb]/5 dark:bg-white/5 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-[#0511bb]" />
            <span className="text-xs font-bold tracking-wider uppercase">New Spring Collection 2024</span>
          </motion.div> */}

          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-br from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-gray-300 dark:to-white leading-tight"
          >
            Redefine <br />
            Your Basic<span className="text-[#0511bb]">.</span>
          </motion.h1>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-2xl font-medium mb-12 text-slate-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Premium, minimalist fashion crafted for the modern individual who values substance and style.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              to="/shop" 
              className="group relative inline-flex items-center gap-2 primary-gradient text-white px-10 py-5 font-bold text-sm rounded-full overflow-hidden shadow-2xl transition-transform hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Shop <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            </Link>
            
            <Link 
              to="/custom-print" 
              className="group inline-flex items-center gap-2 px-10 py-5 font-bold text-sm rounded-full border border-slate-200 dark:border-white/10 glass-panel hover:bg-slate-100 dark:hover:bg-white/10 transition-all shadow-xl hover:scale-105 active:scale-95 text-slate-900 dark:text-white"
            >
              Custom Design
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 flex flex-col items-center gap-2 text-slate-400"
        >
          <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-slate-400 to-transparent" />
          <span className="text-[10px] items-center tracking-widest uppercase font-bold">Scroll</span>
        </motion.div>
      </section>

      {/* Interactive Marquee Section */}
      <section className="relative z-10 border-y border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
        {/* <Marquee content={MARQUEE_CONTENT} baseVelocity={0.8} />
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#0511bb]/10 to-transparent" /> */}
        <Marquee content={MARQUEE_CONTENT} baseVelocity={0.5} direction="left" outline={true} className="py-0 md:py-0 opacity-70" />
      </section>

      {/* Shop By Category */}
      <section className="py-32 px-6 max-w-7xl mx-auto w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-slate-900 dark:text-white">Shop the Essentials</h2>
          <p className="text-slate-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">Foundation pieces designed for comfort and built to last.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative aspect-[4/5] group overflow-hidden rounded-3xl cursor-pointer"
            >
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute inset-x-8 bottom-8 flex justify-between items-end">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{cat.name}</h3>
                  <Link to={cat.path} className="text-white/70 text-sm font-medium flex items-center gap-2 group/btn">
                    Browse More <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 px-6 max-w-7xl mx-auto w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6"
        >
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-slate-900 dark:text-white">Trending Now</h2>
            <p className="text-slate-500 dark:text-gray-400 mt-2">Our most wanted styles this season.</p>
          </div>
          <Link to="/shop" className="group text-sm font-bold tracking-widest uppercase text-[#0511bb] dark:text-blue-400 flex items-center gap-2">
            View All Collection <div className="w-10 h-[1px] bg-[#0511bb] dark:bg-blue-400 transition-all group-hover:w-16" />
          </Link>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {FEATURED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </section>

      {/* Feature Section With Dynamic Cards */}
      <section className="py-32 bg-slate-50 dark:bg-white/2 relative z-10 border-y border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: <Truck className="w-8 h-8" />, title: "Express Shipping", desc: "Global delivery within 2-5 business days. Tracked and secured.", color: "text-blue-500" },
            { icon: <ShieldCheck className="w-8 h-8" />, title: "Premium Quality", desc: "Every piece is double-checked for perfection before leaving us.", color: "text-[#0511bb]" },
            { icon: <RotateCcw className="w-8 h-8" />, title: "Easy Returns", desc: "Changed your mind? 30-day hassle-free returns on all orders.", color: "text-indigo-500" }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-[2rem] glass-panel border border-slate-200 dark:border-white/10 hover:shadow-2xl transition-all duration-500"
            >
              <div className={`mb-6 p-4 w-fit rounded-2xl bg-white dark:bg-white/5 shadow-xl ${feature.color}`}>{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white tracking-tight">{feature.title}</h3>
              <p className="text-slate-500 dark:text-gray-400 leading-relaxed text-lg">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-32 px-6 relative z-10 overflow-hidden">
        <div className="max-w-5xl mx-auto glass-panel rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden border border-[#0511bb]/20">
          <div className="absolute top-0 right-0 p-10 opacity-5">
            <Mail className="w-64 h-64 text-[#0511bb]" />
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 text-slate-900 dark:text-white">Join the Community</h2>
            <p className="text-slate-500 dark:text-gray-400 max-w-xl mx-auto mb-12 text-lg">
              Get 15% off your first order and stay updated with our latest drops.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-8 py-5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#0511bb]/50 transition-all text-slate-900 dark:text-white font-medium"
              />
              <button className="primary-gradient text-white px-10 py-5 rounded-full font-bold shadow-xl hover:scale-105 transition-transform">
                Sign Up
              </button>
            </form>
            <p className="mt-6 text-xs text-slate-400">By signing up, you agree to our Terms and Privacy Policy.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
