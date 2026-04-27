import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ShieldCheck } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

// Razorpay type definitions stub
declare global {
  interface Window {
    Razorpay: any;
  }
}

import { orderService } from '../services/orderService';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotals, clearCart } = useCartStore();
  const { subtotal } = getTotals();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error('Razorpay SDK failed to load. Are you online?');
        setIsProcessing(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_stubkey',
        amount: Math.round(subtotal * 100),
        currency: 'USD',
        name: 'Zeyrox Clothing',
        description: 'Order Payment',
        handler: async function (response: any) {
          try {
            // Save order to Supabase
            await orderService.createOrder({
              email: formData.email,
              total_amount: subtotal,
              shipping_address: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                address: formData.address,
                apartment: formData.apartment,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
                phone: formData.phone,
              },
              items: items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                size: item.size,
                color: item.color,
              }))
            });

            toast.success('Order placed successfully!');
            clearCart();
            navigate('/dashboard');
          } catch (err: any) {
            console.error('Order creation failed:', err);
            toast.error('Payment successful but failed to save order. Please contact support.');
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#0511bb',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      paymentObject.on('payment.failed', function (response: any) {
        toast.error(`Payment Failed: ${response.error.description}`);
      });
      
    } catch (error) {
      toast.error('Payment initialization failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col-reverse lg:flex-row gap-12 relative z-10">
      <div className="flex-1 glass-panel p-8 rounded-3xl border border-white/10">
        <h1 className="text-2xl font-bold tracking-tight mb-8 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">Checkout</h1>
        
        <form onSubmit={handlePayment} className="space-y-8">
          <div>
            <h2 className="text-lg font-medium mb-4 text-white">Contact Information</h2>
            <Input 
              type="email" 
              name="email"
              placeholder="Email address" 
              value={formData.email}
              onChange={handleInputChange}
              required 
              className="mb-4" 
            />
          </div>

          <div>
            <h2 className="text-lg font-medium mb-4 text-white">Shipping Address</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Input 
                name="firstName"
                placeholder="First name" 
                value={formData.firstName}
                onChange={handleInputChange}
                required 
              />
              <Input 
                name="lastName"
                placeholder="Last name" 
                value={formData.lastName}
                onChange={handleInputChange}
                required 
              />
            </div>
            <Input 
              name="address"
              placeholder="Address" 
              value={formData.address}
              onChange={handleInputChange}
              required 
              className="mb-4" 
            />
            <Input 
              name="apartment"
              placeholder="Apartment, suite, etc. (optional)" 
              value={formData.apartment}
              onChange={handleInputChange}
              className="mb-4" 
            />
            <div className="grid grid-cols-3 gap-4 mb-4">
              <Input 
                name="city"
                placeholder="City" 
                value={formData.city}
                onChange={handleInputChange}
                required 
                className="col-span-1" 
              />
              <Input 
                name="state"
                placeholder="State" 
                value={formData.state}
                onChange={handleInputChange}
                required 
                className="col-span-1" 
              />
              <Input 
                name="zipCode"
                placeholder="ZIP code" 
                value={formData.zipCode}
                onChange={handleInputChange}
                required 
                className="col-span-1" 
              />
            </div>
            <Input 
              name="phone"
              placeholder="Phone" 
              type="tel" 
              value={formData.phone}
              onChange={handleInputChange}
              required 
            />
          </div>

          <Button type="submit" size="lg" className="w-full primary-gradient border-none rounded-xl h-14 text-lg" isLoading={isProcessing}>
            Pay Now (${subtotal.toFixed(2)})
          </Button>

          <p className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-4">
            <ShieldCheck className="w-4 h-4 text-purple-400" /> SSL Encrypted Checkout
          </p>
        </form>
      </div>

      <div className="lg:w-[40%]">
        <div className="glass-panel p-6 rounded-3xl sticky top-24 border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.02)]">
          <h2 className="font-medium text-lg mb-4 text-white">In your cart</h2>
          <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 bg-white/5 rounded-2xl border border-white/10">
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-xl overflow-hidden glass-panel">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-blue-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 text-sm flex flex-col justify-center">
                  <p className="font-medium text-white line-clamp-1">{item.name}</p>
                  <p className="text-gray-400">{item.color} {item.size && `/ ${item.size}`}</p>
                </div>
                <p className="text-sm font-medium text-gray-200 flex items-center">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-4 space-y-3 text-sm">
            <div className="flex justify-between text-gray-400">
              <p>Subtotal</p>
              <p className="font-medium text-gray-200">${subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-gray-400">
              <p>Shipping</p>
              <p className="font-medium text-gray-200">Free</p>
            </div>
            <div className="flex justify-between font-bold text-lg pt-3 border-t border-white/10 mt-2 text-white">
              <p>Total</p>
              <p className="drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">${subtotal.toFixed(2)} USD</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
