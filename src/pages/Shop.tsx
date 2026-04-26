import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import { Skeleton } from '../components/ui/Skeleton';
import { motion } from 'framer-motion';

// Mock data fallback if Supabase is unconfigured or empty
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

  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getProducts,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  // Use mock products if the DB fetch fails (e.g., missing Supabase keys) or returns empty
  const displayProducts = (isError || products.length === 0) && !isLoading ? MOCK_PRODUCTS : products;

  const filteredProducts = useMemo(() => {
    return displayProducts
      .filter((p) => (selectedCategory ? p.category === selectedCategory : true))
      .filter((p) => p.price <= priceRange[1])
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0; // newest
      });
  }, [displayProducts, selectedCategory, priceRange, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
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

      <div className="flex-1 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <p className="text-sm text-slate-500 dark:text-gray-400">Showing {filteredProducts.length} products</p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm glass-panel border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:ring-[#0511bb] rounded-lg p-2 outline-none"
          >
            <option value="newest" className="bg-white dark:bg-slate-900">Newest</option>
            <option value="price-asc" className="bg-white dark:bg-slate-900">Price: Low to High</option>
            <option value="price-desc" className="bg-white dark:bg-slate-900">Price: High to Low</option>
          </select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="w-full h-[350px] bg-slate-200 dark:bg-white/10 rounded-2xl" />
                <Skeleton className="w-2/3 h-4 bg-slate-200 dark:bg-white/10" />
                <Skeleton className="w-1/3 h-4 bg-slate-200 dark:bg-white/10" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24 text-slate-500 dark:text-gray-400 glass-panel rounded-3xl mt-8">
            <p>No products found matching your criteria.</p>
            <button 
              onClick={() => { setSelectedCategory(''); setPriceRange([0, 200]); }}
              className="mt-4 text-[#0511bb] hover:text-[#0070f3] transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
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
  );
}
