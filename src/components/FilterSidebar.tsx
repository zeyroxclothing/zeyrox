import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';

interface FilterSidebarProps {
  categories: string[];
  sizes: string[];
  colors: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
}

export default function FilterSidebar(props: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button 
        variant="outline" 
        className="md:hidden flex items-center gap-2 mb-6 w-full"
        onClick={() => setIsOpen(true)}
      >
        <Filter className="w-4 h-4" /> Filters
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#030014]/60 backdrop-blur-md z-[60] md:hidden" 
              onClick={() => setIsOpen(false)}
            />

            {/* Mobile Sidebar */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 max-w-xs w-full bg-white/90 dark:bg-[#030014]/80 backdrop-blur-3xl border-r border-[#0511bb]/10 shadow-[20px_0_60px_rgba(5,17,187,0.05)] dark:shadow-[20px_0_60px_rgba(0,0,0,0.5)] z-[70] p-6 overflow-y-auto md:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Filters</h2>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-500 hover:text-slate-900 dark:hover:text-white" />
                </button>
              </div>

              {/* Duplicate Filter Content for Mobile (simplified or just the same) */}
              <FilterContent {...props} setIsOpen={setIsOpen} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar Content (Static) */}
      <div className="hidden md:block md:w-64">
        <FilterContent {...props} />
      </div>
    </>
  );
}

function FilterContent({
  categories,
  sizes,
  colors,
  selectedCategory,
  setSelectedCategory,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  priceRange,
  setPriceRange,
  setIsOpen
}: FilterSidebarProps & { setIsOpen?: (open: boolean) => void }) {
  return (
    <div className="space-y-8 glass-panel p-6 rounded-3xl">
          {/* Categories */}
          <div>
            <h3 className="font-medium text-slate-900 dark:text-white mb-4">Category</h3>
            <div className="space-y-3">
              {['All', ...categories].map((category) => (
                <label key={category} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === category || (selectedCategory === '' && category === 'All')}
                      onChange={() => setSelectedCategory(category === 'All' ? '' : category)}
                      className="peer appearance-none w-5 h-5 border border-slate-300 dark:border-white/20 rounded-full bg-slate-100 dark:bg-white/5 checked:border-[#0511bb] transition-all cursor-pointer"
                    />
                    <div className="absolute w-2.5 h-2.5 bg-[#0511bb] rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none shadow-[0_0_8px_rgba(5,17,187,0.8)]"></div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="font-medium text-slate-900 dark:text-white mb-4">Size</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                  className={`min-w-[3rem] h-10 rounded-lg text-sm flex items-center justify-center transition-all duration-300 ${
                    selectedSize === size
                      ? 'primary-gradient text-white border border-transparent'
                      : 'bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:border-[#0511bb] hover:text-[#0511bb]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <h3 className="font-medium text-slate-900 dark:text-white mb-4">Color</h3>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(selectedColor === color ? '' : color)}
                  className={`px-4 h-10 rounded-lg text-sm flex items-center justify-center transition-all duration-300 ${
                    selectedColor === color
                      ? 'primary-gradient text-white border border-transparent'
                      : 'bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:border-[#0511bb] hover:text-[#0511bb]'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-medium text-slate-900 dark:text-white mb-4">Max Price: ${priceRange[1]}</h3>
            <input
              type="range"
              min="0"
              max="200"
              step="5"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, Number(e.target.value)])}
              className="w-full accent-[#0511bb] cursor-pointer"
            />
          </div>
          {setIsOpen && (
            <div className="mt-8">
              <Button className="w-full h-12 rounded-xl primary-gradient border-none" onClick={() => setIsOpen(false)}>Apply Filters</Button>
            </div>
          )}
        </div>
      );
    }
