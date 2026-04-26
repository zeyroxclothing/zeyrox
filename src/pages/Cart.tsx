import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { Button } from '../components/ui/Button';

export default function Cart() {
  const { items, updateQuantity, removeItem, getTotals } = useCartStore();
  const { subtotal } = getTotals();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col items-center justify-center text-center relative z-10 glass-panel rounded-3xl mt-12">
        <ShoppingBag className="w-16 h-16 text-purple-400 mb-6 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
        <h1 className="text-3xl font-bold tracking-tight mb-4 text-white">Your cart is empty</h1>
        <p className="text-gray-400 mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Go ahead and explore our latest collections.</p>
        <Link to="/shop">
          <Button size="lg" className="primary-gradient border-none rounded-xl">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
      <h1 className="text-3xl font-bold tracking-tight mb-10 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3 glass-panel rounded-3xl p-8 border border-white/10">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-sm font-medium text-gray-400">
                <th className="pb-4 font-medium">Product</th>
                <th className="pb-4 font-medium hidden md:table-cell">Price</th>
                <th className="pb-4 font-medium">Quantity</th>
                <th className="pb-4 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {items.map((item) => (
                <tr key={item.id} className="group">
                  <td className="py-6 flex gap-4 items-center">
                    {item.image && (
                      <div className="w-24 h-32 bg-white/5 rounded-xl overflow-hidden shrink-0 border border-white/10">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-white leading-tight mb-1">{item.name}</h3>
                      <div className="text-sm text-gray-400 space-x-2">
                        {item.color && <span>{item.color}</span>}
                        {item.color && item.size && <span>|</span>}
                        {item.size && <span>{item.size}</span>}
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-red-400 hover:text-red-300 transition-colors font-medium mt-3 md:hidden"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                  <td className="py-6 hidden md:table-cell text-gray-200">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="py-6">
                    <div className="flex items-center w-min border border-white/20 bg-white/5 rounded-lg overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="py-6 text-right font-medium text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                    ${(item.price * item.quantity).toFixed(2)}
                    <br />
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-sm text-red-400 hover:text-red-300 font-medium mt-3 hidden md:inline-block opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:w-1/3">
          <div className="glass-panel p-8 rounded-3xl sticky top-24 shadow-[0_0_50px_rgba(255,255,255,0.02)]">
            <h2 className="text-lg font-bold tracking-tight mb-6 text-white">Order Summary</h2>
            <div className="flex justify-between mb-4 text-gray-400">
              <p>Subtotal</p>
              <p className="font-medium text-gray-200">${subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between mb-6 text-gray-400">
              <p>Shipping</p>
              <p className="font-medium text-gray-200">Calculated at checkout</p>
            </div>
            <div className="border-t border-white/10 pt-6 flex justify-between mb-8">
              <p className="font-bold text-lg text-white">Total</p>
              <p className="font-bold text-lg text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">${subtotal.toFixed(2)} USD</p>
            </div>
            <Link to="/checkout" className="block w-full">
              <Button size="lg" className="w-full flex items-center justify-center gap-2 primary-gradient border-none rounded-xl">
                Checkout <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
