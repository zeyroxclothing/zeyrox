import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import { Skeleton } from '../components/ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, List, SlidersHorizontal } from 'lucide-react';

const MOCK_PRODUCTS = [
  { id: '1', name: 'Oversized Essential Premium Tee', price: 35.00, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800', category: 'T-Shirts' },
  { id: '2', name: 'Minimalist Heavyweight Hoodie', price: 65.00, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800', category: 'Hoodies' },
  { id: '3', name: 'Relaxed Fit Cargo Pants', price: 85.00, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800', category: 'Bottoms' },
  { id: '4', name: 'Signature Boxy Crop Top', price: 28.00, image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800', category: 'T-Shirts' }
];

const CATEGORIES = ['T-Shirts', 'Hoodies', 'Bottoms', 'Accessories'];
const SIZES = ['S', 'M', 'L', 'XL'];
const COLORS = ['Black', 'White', 'Gray', 'Olive'];

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [priceRange, setPriceRange] = useState<number[]>([0, 200]);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getProducts,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const displayProducts = (isError || products.length === 0) && !isLoading ? MOCK_PRODUCTS : products;

  const filteredProducts = useMemo(() => {
    return displayProducts
      .filter((p) => (selectedCategory ? p.category === selectedCategory : true))
      .filter((p) => p.price <= priceRange[1])
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0;
      });
  }, [displayProducts, selectedCategory, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#020110]">
      {/* Shop Header */}
      <div className="relative pt-32 pb-20 px-6 overflow-hidden border-b border-slate-200 dark:border-white/5">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0511bb]/5 rounded-full blur-[120px]" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center"
          >
            <span className="text-[#0511bb] font-bold tracking-[0.3em] uppercase text-xs mb-4">Collection</span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 dark:text-white mb-6">
              All Products<span className="text-[#0511bb]">.</span>
            </h1>
            <p className="text-slate-500 dark:text-gray-400 max-w-2xl text-lg leading-relaxed">
              Discover our core collection of minimalist essentials, crafted with precision and sustainably sourced materials.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between mb-6">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 glass-panel rounded-full text-sm font-bold"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm bg-transparent border-none text-slate-900 dark:text-white focus:ring-0 outline-none font-bold"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-72 shrink-0`}>
            <div className="sticky top-24">
              <FilterSidebar
                categories={CATEGORIES}
                sizes={SIZES}
                colors={COLORS}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
              />
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="hidden lg:flex justify-between items-center mb-12">
              <div className="flex items-center gap-4">
                <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10">
                  <button className="p-2 bg-white dark:bg-white/10 rounded-lg shadow-sm"><LayoutGrid className="w-4 h-4" /></button>
                  <button className="p-2 text-slate-400"><List className="w-4 h-4" /></button>
                </div>
                <p className="text-sm text-slate-500 font-medium">Showing {filteredProducts.length} results</p>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Sort By</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm glass-panel border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl px-4 py-2 outline-none font-bold min-w-[160px]"
                >
                  <option value="newest">Newest Drop</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="w-full h-[400px] bg-slate-200 dark:bg-white/10 rounded-[2rem]" />
                    <Skeleton className="w-2/3 h-4 bg-slate-200 dark:bg-white/10 rounded-full" />
                    <Skeleton className="w-1/3 h-4 bg-slate-200 dark:bg-white/10 rounded-full" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-32 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-white/5"
              >
                <div className="mb-6 inline-flex p-6 rounded-full bg-slate-100 dark:bg-white/5"><SlidersHorizontal className="w-12 h-12 text-slate-300" /></div>
                <h3 className="text-2xl font-bold mb-2">No products found</h3>
                <p className="text-slate-500 dark:text-gray-400 mb-8">Try adjusting your filters or search criteria.</p>
                <button 
                  onClick={() => { setSelectedCategory(''); setPriceRange([0, 200]); }}
                  className="px-8 py-3 primary-gradient text-white rounded-full font-bold shadow-xl"
                >
                  Reset All Filters
                </button>
              </motion.div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
