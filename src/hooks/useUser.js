import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export function useUser() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        // Fetch role from profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        setRole(data?.role || null);
      }
      setLoading(false);
    };
    getUser();
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => getUser());
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return { user, role, loading };
}
