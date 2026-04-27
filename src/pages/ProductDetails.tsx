import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Check, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { productService } from '../services/productService';
import { useCartStore } from '../store/cartStore';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data
const MOCK_PRODUCT = {
  id: '1',
  name: 'Oversized Essential Premium Tee',
  price: 35.00,
  description: 'Our signature oversized tee crafted from premium 100% organic heavyweight cotton. Features a dropped shoulder, ribbed crewneck, and a relaxed boxy fit that drapes perfectly. Preshrunk to ensure a lasting fit.',
  image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
  images: [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800',
  ],
  category: 'T-Shirts',
  stock: 12,
};

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const COLORS = ['Black', 'White', 'Heather Gray'];

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [activeImage, setActiveImage] = useState(0);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id!),
    enabled: !!id,
    retry: false,
  });

  const displayProduct = product;

  if (isError || !displayProduct && !isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 text-center relative z-10">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12 relative z-10">
        <Skeleton className="w-full md:w-1/2 h-[600px] bg-white/10 rounded-3xl" />
        <div className="w-full md:w-1/2 space-y-6">
          <Skeleton className="w-3/4 h-10 bg-white/10 rounded-xl" />
          <Skeleton className="w-1/4 h-6 bg-white/10 rounded-lg" />
          <Skeleton className="w-full h-32 bg-white/10 rounded-2xl" />
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error('Please select both size and color.');
      return;
    }

    addItem({
      id: `${displayProduct.id}-${selectedSize}-${selectedColor}`,
      productId: displayProduct.id,
      name: displayProduct.name,
      price: displayProduct.price,
      quantity: 1,
      size: selectedSize,
      color: selectedColor,
      image: Array.isArray(displayProduct.images) ? displayProduct.images[0] : displayProduct.image,
    });

    toast.success('Added to cart');
    openCart();
  };

  const images = Array.isArray(displayProduct.images) ? displayProduct.images : [displayProduct.image];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Image Gallery */}
        <div className="w-full md:w-1/2 flex gap-4">
          <div className="flex flex-col gap-4 w-20">
            {images.map((img: string, idx: number) => (
              <button 
                key={idx} 
                onClick={() => setActiveImage(idx)}
                className={`border-2 rounded-lg overflow-hidden transition-all ${activeImage === idx ? 'border-[#0511bb] shadow-[0_0_10px_rgba(5,17,187,0.5)]' : 'border-transparent opacity-50 hover:opacity-100'}`}
              >
                <img src={img} alt={`Thumbnail ${idx}`} className="w-full object-cover aspect-[3/4]" />
              </button>
            ))}
          </div>
          <div className="flex-1 glass-panel rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.05)] p-2 relative">
            <AnimatePresence mode="wait">
              <motion.img 
                key={activeImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                src={images[activeImage]} 
                alt={displayProduct.name} 
                className="w-full object-cover aspect-[3/4] rounded-2xl" 
              />
            </AnimatePresence>
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 flex flex-col glass-panel p-8 rounded-3xl">
          <p className="text-sm text-[#0511bb] dark:text-blue-400 mb-2 font-bold tracking-wider uppercase">{displayProduct.category}</p>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white drop-shadow-[0_0_8px_rgba(5,17,187,0.1)] dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{displayProduct.name}</h1>
          <p className="text-2xl font-medium mb-6 text-slate-800 dark:text-gray-200">${displayProduct.price.toFixed(2)}</p>

          <p className="text-slate-600 dark:text-gray-400 mb-8 leading-relaxed">
            {displayProduct.description}
          </p>

          {/* Color Selection */}
          <div className="mb-6">
            <div className="flex justify-between mb-3">
              <span className="font-medium text-sm text-slate-700 dark:text-gray-300">Color: <span className="text-slate-900 dark:text-white font-normal">{selectedColor || 'Select'}</span></span>
            </div>
            <div className="flex gap-4">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className="relative w-12 h-12 rounded-full flex items-center justify-center transition-all focus:outline-none"
                >
                  {selectedColor === color && (
                    <motion.div 
                      layoutId="color-outline"
                      className="absolute inset-[-4px] border-2 border-[#0511bb] rounded-full shadow-[0_0_15px_rgba(5,17,187,0.5)]"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                  <div 
                    className={`w-full h-full rounded-full border border-white/10 flex items-center justify-center transition-transform ${selectedColor === color ? 'scale-90' : 'hover:scale-105'}`}
                    style={{ backgroundColor: color === 'Black' ? '#111' : color === 'White' ? '#fff' : '#6b7280' }}
                  >
                    {selectedColor === color && <Check className={`w-5 h-5 ${color === 'White' ? 'text-black' : 'text-white'}`} />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-8">
            <div className="flex justify-between mb-3">
              <span className="font-medium text-sm text-slate-700 dark:text-gray-300">Size: <span className="text-slate-900 dark:text-white font-normal">{selectedSize || 'Select'}</span></span>
              <button className="text-sm text-[#0511bb] dark:text-blue-400 hover:underline">Size Guide</button>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className="relative h-12 flex items-center justify-center"
                >
                  {selectedSize === size && (
                    <motion.div 
                      layoutId="size-bg"
                      className="absolute inset-0 primary-gradient rounded-xl shadow-[0_0_15px_rgba(5,17,187,0.4)]"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                  <span className={`relative z-10 text-sm font-medium transition-colors duration-300 ${selectedSize === size ? 'text-white' : 'text-slate-600 dark:text-gray-300 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                    {size}
                  </span>
                  {selectedSize !== size && (
                    <div className="absolute inset-0 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:border-[#0511bb] dark:hover:border-white/30 transition-all" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mb-4 mt-auto">
            <Button 
              variant="primary"
              className="flex-1 rounded-xl font-semibold shadow-[0_0_20px_rgba(5,17,187,0.3)] hover:shadow-[0_0_30px_rgba(5,17,187,0.5)] transition-all primary-gradient border-none" 
              size="lg" 
              onClick={handleAddToCart}
            >
              Add to Cart - ${(displayProduct.price).toFixed(2)}
            </Button>
          </div>
          <p className="text-sm text-slate-500 dark:text-gray-400 text-center mb-8">
            {MOCK_PRODUCT.stock > 0 ? (
              <span className="text-[#0511bb] dark:text-blue-400 font-bold drop-shadow-[0_0_5px_rgba(5,17,187,0.2)]">In Stock ({MOCK_PRODUCT.stock} items left)</span>
            ) : 'Out of stock'}
          </p>

          <div className="border-t border-slate-200 dark:border-white/10 pt-6 mt-4 space-y-4 text-sm text-slate-500 dark:text-gray-400">
            <div className="flex items-center gap-3"><Truck className="w-5 h-5 text-[#0511bb] dark:text-blue-400" /> Free shipping over $100</div>
            <div className="flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-blue-500 dark:text-blue-400" /> Lifetime quality guarantee</div>
            <div className="flex items-center gap-3"><RotateCcw className="w-5 h-5 text-[#0511bb] dark:text-blue-400" /> Free returns within 30 days</div>
          </div>
        </div>
      </div>
    </div>
  );
}
