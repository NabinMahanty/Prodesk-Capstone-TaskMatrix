import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,        // { uid, email, displayName, photoURL }
  loading: true,     // true while Firebase is resolving auth state

  setUser: (user) => set({ user, loading: false }),
  clearUser: () => set({ user: null, loading: false }),
  setLoading: (loading) => set({ loading }),
}));

export default useAuthStore;
