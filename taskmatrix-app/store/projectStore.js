import { create } from 'zustand';
import supabase from '@/lib/supabase';
import useAuthStore from '@/store/authStore';

const useProjectStore = create((set, get) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.uid)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ projects: data || [], loading: false });
    } catch (error) {
      console.error('Error fetching projects:', error.message);
      set({ error: error.message, loading: false });
    }
  },

  addProject: async (projectData) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const newProject = {
      ...projectData,
      user_id: user.uid,
    };

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([newProject])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ projects: [data, ...state.projects] }));
    } catch (error) {
      console.error('Error adding project:', error.message);
      throw error;
    }
  },

  updateProject: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        projects: state.projects.map((proj) => (proj.id === id ? data : proj)),
      }));
    } catch (error) {
      console.error('Error updating project:', error.message);
      throw error;
    }
  },

  deleteProject: async (id) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        projects: state.projects.filter((proj) => proj.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting project:', error.message);
      throw error;
    }
  },
}));

export default useProjectStore;
