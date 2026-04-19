import { create } from 'zustand';
import supabase from '@/lib/supabase';

const useUserStore = create((set) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('email');

      if (error) throw error;
      set({ users: data || [], loading: false });
    } catch (error) {
      console.error('Error fetching users:', error.message);
      set({ error: error.message, loading: false });
    }
  },
}));

export default useUserStore;
