
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export type UserRole =
  | 'admin'
  | 'inventory_staff'
  | 'teacher';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  department_id: string | null;
}

interface AuthContextType {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(userId: string) {
    console.log('LOAD PROFILE:', userId);

    const { data, error } = await supabase
      .from('profiles')
      .select(
        'id, full_name, role, department_id'
      )
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error(
        'PROFILE ERROR:',
        error
      );

      setProfile(null);
      return;
    }

    console.log(
      'PROFILE DATA:',
      data
    );

    setProfile(
      data as Profile | null
    );
  }

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error(
            'GET SESSION ERROR:',
            error
          );
        }

        if (!mounted) return;

        setSession(currentSession);

        if (currentSession?.user?.id) {
          await loadProfile(
            currentSession.user.id
          );
        } else {
          setProfile(null);
        }

        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error(
          'AUTH INIT ERROR:',
          error
        );

        if (mounted) {
          setSession(null);
          setProfile(null);
          setLoading(false);
        }
      }
    }

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log(
          'AUTH EVENT:',
          event
        );

        if (!mounted) return;

        if (event === 'SIGNED_OUT') {
          setSession(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        if (
          event === 'SIGNED_IN' &&
          newSession?.user?.id
        ) {
          setSession(newSession);

          setTimeout(() => {
            if (!mounted) return;

            loadProfile(
              newSession.user.id
            );
          }, 0);
        }

        if (
          event === 'TOKEN_REFRESHED' &&
          newSession
        ) {
          setSession(newSession);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function logout() {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      console.error(
        'LOGOUT ERROR:',
        error
      );
    }

    setSession(null);
    setProfile(null);
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        profile,
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    );
  }

  return context;
}

