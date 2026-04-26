import { supabase } from '../lib/supabase';

export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      if (error.status === 0 || error.message.includes('FetchError')) {
         console.warn("Supabase not fully setup, mocking login");
         return {
           user: { id: 'mock-user', email },
           session: { access_token: 'mock-token' }
         }
      }
      throw error;
    }
    return data;
  },

  async signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });
    if (error) {
       if (error.status === 0 || error.message.includes('FetchError')) {
         console.warn("Supabase not fully setup, mocking signup");
         return {
           user: { id: 'mock-user', email, user_metadata: { full_name: name } },
           session: { access_token: 'mock-token' }
         }
      }
      throw error;
    }
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error && error.status !== 0) throw error;
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
       console.warn('Get session error', error);
       return { session: null };
    }
    return data;
  },
};
