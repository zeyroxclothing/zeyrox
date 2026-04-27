import { supabase } from '../lib/supabase';
import type { CartItem } from '../store/cartStore';

export const cartService = {
  async getCart(userId: string) {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products (*)
      `)
      .eq('user_id', userId);

    if (error) throw error;
    
    return data.map(item => ({
      id: `${item.product_id}-${item.size}-${item.color}`,
      productId: item.product_id,
      name: item.products.name,
      price: item.products.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      image: item.products.image
    })) as CartItem[];
  },

  async syncItem(userId: string, item: CartItem) {
    const { error } = await supabase
      .from('cart_items')
      .upsert({
        user_id: userId,
        product_id: item.productId,
        quantity: item.quantity,
        size: item.size,
        color: item.color
      }, { onConflict: 'user_id, product_id, size, color' });

    if (error) throw error;
  },

  async removeItem(userId: string, item: CartItem) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .match({
        user_id: userId,
        product_id: item.productId,
        size: item.size,
        color: item.color
      });

    if (error) throw error;
  },

  async clearCart(userId: string) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  }
};
