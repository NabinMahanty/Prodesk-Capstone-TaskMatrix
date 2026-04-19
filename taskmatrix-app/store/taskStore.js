import { create } from 'zustand';
import supabase from '@/lib/supabase';
import useAuthStore from '@/store/authStore';

const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.uid)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ tasks: data || [], loading: false });
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
      set({ error: error.message, loading: false });
    }
  },

  addTask: async (taskData) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const newTask = {
      ...taskData,
      user_id: user.uid,
    };

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([newTask])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ tasks: [data, ...state.tasks] }));
    } catch (error) {
      console.error('Error adding task:', error.message);
      throw error;
    }
  },

  updateTask: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        tasks: state.tasks.map((task) => (task.id === id ? data : task)),
      }));
    } catch (error) {
      console.error('Error updating task:', error.message);
      throw error;
    }
  },

  deleteTask: async (id) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting task:', error.message);
      throw error;
    }
  },
}));

export default useTaskStore;
