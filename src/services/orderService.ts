import { supabase } from '../lib/supabase';

export interface OrderInput {
  email: string;
  total_amount: number;
  shipping_address: {
    firstName: string;
    lastName: string;
    address: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  items: {
    productId: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }[];
}

export const orderService = {
  async createOrder(orderInput: OrderInput) {
    const { items, ...orderData } = orderInput;
    
    // Get current user if logged in
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Insert search order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        ...orderData,
        user_id: user?.id || null,
        status: 'completed',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Insert order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      price_at_time: item.price,
      size: item.size,
      color: item.color,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return order;
  },

  async getUserOrders() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};
