import { supabase } from '../lib/supabase';

export interface CustomDesign {
  id: string;
  user_id: string;
  image_url: string; // The generated html2canvas image
  design_data: any; // JSON representation of coordinates, texts, etc
  created_at?: string;
}

export const designService = {
  async saveDesign(designData: Omit<CustomDesign, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('designs')
      .insert([designData])
      .select()
      .single();

    if (error) {
      console.error('Supabase Error details:', error);
      // Fallback for mocked mode
      if (error.code === 'PGRST301' || error.message.includes('FetchError') || error.message.includes('Failed to fetch')) {
        console.warn('Mocking save due to missing/invalid Supabase connection');
        return { ...designData, id: `mock-${Date.now()}` } as CustomDesign;
      }
      throw error;
    }
    
    return data as CustomDesign;
  },

  async getUserDesigns(userId: string) {
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as CustomDesign[];
  }
};
