import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { Button } from './ui/Button';

export default function CartDrawer() {
  const { isOpen, closeCart, items, updateQuantity, removeItem, getTotals } = useCartStore();
  const { subtotal } = getTotals();

  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-slate-900/10 dark:bg-black/30 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-[#030014]/60 backdrop-blur-3xl shadow-[-10px_0_30px_rgba(0,0,0,0.1)] dark:shadow-[-10px_0_30px_rgba(0,0,0,0.5)] border-l border-slate-200 dark:border-white/10 z-[70] flex flex-col pointer-events-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/10">
              <h2 className="text-lg font-medium text-slate-900 dark:text-white flex items-center gap-2 drop-shadow-[0_0_8px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                <ShoppingBag className="w-5 h-5 text-[#0511bb]" /> Your Cart
              </h2>
              <button 
                onClick={closeCart}
                className="text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-gray-400 space-y-4">
                  <ShoppingBag className="w-12 h-12 opacity-20" />
                  <p>Your cart is empty.</p>
                  <Button variant="outline" onClick={closeCart} className="border-[#0511bb] text-[#0511bb]">Continue Shopping</Button>
                </div>
              ) : (
                <motion.ul 
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.05
                      }
                    }
                  }}
                  className="space-y-6"
                >
                  {items.map((item) => (
                    <motion.li 
                      variants={{
                        hidden: { opacity: 0, x: 20 },
                        visible: { opacity: 1, x: 0 }
                      }}
                      key={item.id} 
                      className="flex gap-4 group"
                    >
                      {item.image && (
                        <div className="w-20 h-24 rounded-xl overflow-hidden glass-panel shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      )}
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between text-base font-semibold text-slate-900 dark:text-white">
                          <h3>{item.name}</h3>
                          <p className="ml-4 pl-2 drop-shadow-[0_0_8px_rgba(5,17,187,0.1)]">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="mt-1 flex text-xs text-slate-500 dark:text-gray-400 space-x-2">
                          {item.color && <p>Color: {item.color}</p>}
                          {item.size && <p>Size: {item.size}</p>}
                        </div>
                        <div className="flex-1 flex items-end justify-between text-sm mt-3">
                          <div className="flex items-center border border-slate-200 dark:border-white/20 rounded-lg overflow-hidden bg-slate-100 dark:bg-white/5 backdrop-blur-sm">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-slate-900 dark:text-gray-200 font-medium">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="font-medium text-red-400 hover:text-red-300 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-slate-200 dark:border-white/10 p-6 space-y-4 bg-slate-50 dark:bg-white/5 backdrop-blur-md">
                <div className="flex justify-between text-base font-semibold text-slate-900 dark:text-white">
                  <p>Subtotal</p>
                  <p className="drop-shadow-[0_0_8px_rgba(5,17,187,0.1)]">${subtotal.toFixed(2)}</p>
                </div>
                <p className="text-sm text-slate-500 dark:text-gray-400">Shipping and taxes calculated at checkout.</p>
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/cart" onClick={closeCart}>
                    <Button variant="outline" className="w-full h-12 border-slate-200 dark:border-white/10">View Cart</Button>
                  </Link>
                  <Link to="/checkout" onClick={closeCart}>
                    <Button className="w-full h-12 primary-gradient border-none">Checkout</Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </Fragment>
      )}
    </AnimatePresence>
  );
}
