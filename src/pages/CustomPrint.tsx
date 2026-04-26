import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rnd } from 'react-rnd';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';
import { ImagePlus, Type, Save, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { designService } from '../services/designService';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';

interface ElementData {
  id: string;
  type: 'text' | 'image';
  content?: string;
  src?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  color?: string;
}

export default function CustomPrint() {
  const [elements, setElements] = useState<ElementData[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const printAreaRef = useRef<HTMLDivElement>(null);

  const { user } = useAuthStore();
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const addText = () => {
    setElements([
      ...elements,
      {
        id: Date.now().toString(),
        type: 'text',
        content: 'Your Text Here',
        x: 50,
        y: 50,
        color: '#000000',
      },
    ]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setElements([
        ...elements,
        {
          id: Date.now().toString(),
          type: 'image',
          src: event.target?.result as string,
          x: 50,
          y: 50,
          width: 100,
          height: 100,
        },
      ]);
    };
    reader.readAsDataURL(file);
  };

  const updateElement = (id: string, updates: Partial<ElementData>) => {
    setElements(elements.map((el) => (el.id === id ? { ...el, ...updates } : el)));
  };

  const removeElement = (id: string) => {
    setElements(elements.filter((el) => el.id !== id));
  };

  const generatePreview = async () => {
    if (!printAreaRef.current) return null;
    try {
      const canvas = await html2canvas(printAreaRef.current, {
        useCORS: true,
        backgroundColor: null,
      });
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Failed to generate preview', error);
      return null;
    }
  };

  const handleSaveDesign = async () => {
    if (!user) {
      toast.error('Please log in to save designs');
      return;
    }
    if (elements.length === 0) {
      toast.error('Add some elements to save!');
      return;
    }

    setIsSaving(true);
    try {
      const previewUrl = await generatePreview();
      if (!previewUrl) throw new Error('Failed to generate image preview');

      await designService.saveDesign({
        user_id: user.id,
        image_url: previewUrl,
        design_data: elements,
      });

      toast.success('Design saved successfully!');
    } catch (error) {
      toast.error('Failed to save design');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddToCart = async () => {
    if (elements.length === 0) {
      toast.error('Add some elements to your design before purchasing!');
      return;
    }

    setIsAddingToCart(true);
    try {
      const previewUrl = await generatePreview();
      if (!previewUrl) throw new Error('Failed to generate image preview');

      // In a real app we'd upload the image to Supabase Storage first and get a public URL
      // Here we just use the data URL for the cart preview

      addItem({
        id: `custom-${Date.now()}`,
        productId: 'custom-tee-01',
        name: 'Custom Printed T-Shirt',
        price: 45.00,
        quantity: 1,
        image: previewUrl,
        size: 'M',
        color: 'White', // Default to white for custom blanks here
      });

      toast.success('Custom design added to cart!');
      openCart();
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white drop-shadow-[0_0_8px_rgba(5,17,187,0.1)] dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">Custom Print Studio</h1>
        <p className="text-gray-500 dark:text-gray-400">Design your own premium ZEYROX apparel.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Editor Tools */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full lg:w-1/3 glass-panel p-6 rounded-3xl"
        >
          <h2 className="text-lg font-semibold mb-6 text-slate-900 dark:text-white">Tools</h2>
          
          <div className="space-y-4 mb-8">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={addText}>
              <Type className="w-4 h-4" /> Add Text
            </Button>
            
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" className="w-full flex items-center justify-center gap-2 pointer-events-none">
                <ImagePlus className="w-4 h-4" /> Upload Image
              </Button>
            </div>
          </div>

          <div className="space-y-4 mb-4">
            <h3 className="font-medium text-sm text-slate-700 dark:text-gray-300 border-b border-slate-200 dark:border-white/10 pb-2 mb-4">Layers</h3>
            <AnimatePresence>
              {elements.length === 0 ? (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-gray-500 dark:text-gray-400 text-center py-4"
                >
                  No layers yet.
                </motion.p>
              ) : (
                <div className="space-y-3">
                  {elements.map((el) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={el.id} 
                      className="flex items-center justify-between p-3 bg-slate-100 dark:bg-white/5 rounded-xl text-sm border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                    >
                      <span className="truncate flex-1 font-medium">{el.type === 'text' ? el.content : 'Image Layer'}</span>
                      {el.type === 'text' && (
                        <input 
                          type="color" 
                          value={el.color || '#ffffff'} 
                          onChange={(e) => updateElement(el.id, { color: e.target.value })}
                          className="w-6 h-6 p-0 border-0 mr-2 bg-transparent cursor-pointer"
                        />
                      )}
                      <button onClick={() => removeElement(el.id)} className="text-red-500 hover:text-red-400 ml-2">Remove</button>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={handleSaveDesign} isLoading={isSaving} className="w-full rounded-xl">
              <Save className="w-4 h-4 mr-2" /> Save
            </Button>
            <Button onClick={handleAddToCart} isLoading={isAddingToCart} className="w-full rounded-xl primary-gradient border-none">
              <ShoppingBag className="w-4 h-4 mr-2" /> Buy ($45)
            </Button>
          </div>
        </motion.div>

        {/* Canvas Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full lg:w-2/3 glass-panel flex items-center justify-center p-8 min-h-[600px] rounded-3xl border border-white/10"
        >
          <div 
            className="relative shadow-[0_0_50px_rgba(255,255,255,0.1)] border-2 border-white/20 w-[400px] h-[500px] overflow-hidden rounded-xl"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
             {/* Printable Area boundary visual */}
            <div 
              ref={printAreaRef}
              className="absolute top-1/4 left-1/4 right-1/4 bottom-1/4 border border-[#0511bb]/30 bg-slate-100/20 dark:bg-white/20 overflow-hidden"
            >
              {elements.map((el) => (
                <Rnd
                  key={el.id}
                  position={{ x: el.x, y: el.y }}
                  size={el.type === 'image' ? { width: el.width || 'auto', height: el.height || 'auto' } : undefined}
                  onDragStop={(_, d) => updateElement(el.id, { x: d.x, y: d.y })}
                  onResizeStop={(_, __, ref, ___, position) => {
                    updateElement(el.id, {
                      width: parseInt(ref.style.width, 10),
                      height: parseInt(ref.style.height, 10),
                      ...position,
                    });
                  }}
                  bounds="parent"
                  enableResizing={el.type === 'image'}
                  className={el.type === 'text' ? 'cursor-text' : 'cursor-move'}
                >
                  {el.type === 'text' ? (
                    <input
                      type="text"
                      value={el.content}
                      onChange={(e) => updateElement(el.id, { content: e.target.value })}
                      style={{ color: el.color }}
                      className="bg-transparent border-none outline-none font-bold text-2xl w-auto text-center"
                    />
                  ) : (
                    <img 
                      src={el.src} 
                      alt="Custom layer" 
                      className="w-full h-full object-contain pointer-events-none" 
                    />
                  )}
                </Rnd>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
