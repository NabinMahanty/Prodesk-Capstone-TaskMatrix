'use client';

import { useEffect } from 'react';
import supabase from '@/lib/supabase';
import useAuthStore from '@/store/authStore';

/**
 * AuthProvider – sits in the root layout.
 * Subscribes to Supabase onAuthStateChange and syncs to Zustand.
 * Also manages the session cookie used by proxy.js.
 */
export default function AuthProvider({ children }) {
  const { setUser, clearUser } = useAuthStore();

  useEffect(() => {
    // Get the current session on mount (handles page refresh)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        syncUser(session);
      } else {
        clearCookieAndStore();
      }
    });

    // Listen for future auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          syncUser(session);
        } else {
          clearCookieAndStore();
        }
      }
    );

    return () => subscription.unsubscribe();

    function syncUser(session) {
      const u = session.user;
      // Set cookie for the proxy.js route guard
      document.cookie = `taskmatrix_auth_token=${session.access_token}; path=/; max-age=3600; SameSite=Strict`;

      setUser({
        uid: u.id,
        email: u.email,
        displayName:
          u.user_metadata?.full_name ||
          u.user_metadata?.name ||
          u.email?.split('@')[0],
        photoURL: u.user_metadata?.avatar_url || null,
      });
    }

    function clearCookieAndStore() {
      document.cookie = 'taskmatrix_auth_token=; path=/; max-age=0';
      clearUser();
    }
  }, [setUser, clearUser]);

  return <>{children}</>;
}
