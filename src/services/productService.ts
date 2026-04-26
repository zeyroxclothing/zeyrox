import { supabase } from '../lib/supabase';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  created_at?: string;
}

export const productService = {
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Product[];
  },

  async getProductById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Product;
  },
};
