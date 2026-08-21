import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, Role, Site } from '../types';
import { SEED_PROFILES } from '../data/seed-data';
import { dataStore } from '../services/data-store';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: Profile | null;
  currentRole: Role | null;
  accessibleSites: { site: Site; role: Role }[];
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  switchUser: (userId: string) => Promise<void>;
  hasRole: (allowedRoles: Role[]) => boolean;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Admin A for immediate demonstrability
  const [user, setUser] = useState<Profile | null>(() => {
    const saved = localStorage.getItem('wl_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return SEED_PROFILES[0];
      }
    }
    return SEED_PROFILES[0];
  });

  const [accessibleSites, setAccessibleSites] = useState<{ site: Site; role: Role }[]>([]);
  const [currentRole, setCurrentRole] = useState<Role | null>('owner');
  const [isLoading, setIsLoading] = useState(true);

  const refreshUserData = async () => {
    if (!user) {
      setAccessibleSites([]);
      setCurrentRole(null);
      setIsLoading(false);
      return;
    }

    try {
      const sites = await dataStore.getUserSites(user.id);
      setAccessibleSites(sites);
      if (sites.length > 0) {
        setCurrentRole(sites[0].role);
      } else {
        setCurrentRole(null);
      }
    } catch (e) {
      console.error('Error refreshing user data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUserData();

    // Supabase auth subscription if configured
    if (isSupabaseConfigured && supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const profile: Profile = {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuário',
            avatar_url: session.user.user_metadata?.avatar_url,
            created_at: session.user.created_at,
          };
          setUser(profile);
          localStorage.setItem('wl_current_user', JSON.stringify(profile));
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('wl_current_user');
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, [user?.id]);

  const login = async (email: string, password?: string): Promise<boolean> => {
    setIsLoading(true);

    if (isSupabaseConfigured && supabase && password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setIsLoading(false);
        throw new Error(error.message);
      }
      if (data.user) {
        const profile: Profile = {
          id: data.user.id,
          email: data.user.email || email,
          full_name: data.user.user_metadata?.full_name || email.split('@')[0],
          avatar_url: data.user.user_metadata?.avatar_url,
          created_at: data.user.created_at,
        };
        setUser(profile);
        localStorage.setItem('wl_current_user', JSON.stringify(profile));
        setIsLoading(false);
        return true;
      }
    }

    // Local authentication / Demo mode
    const matchedProfile = SEED_PROFILES.find(p => p.email.toLowerCase() === email.toLowerCase()) || {
      id: `user-${Date.now()}`,
      email,
      full_name: email.split('@')[0],
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      created_at: new Date().toISOString(),
    };

    setUser(matchedProfile);
    localStorage.setItem('wl_current_user', JSON.stringify(matchedProfile));
    setIsLoading(false);
    return true;
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('wl_current_user');
    setAccessibleSites([]);
    setCurrentRole(null);
  };

  const switchUser = async (userId: string) => {
    setIsLoading(true);
    const target = SEED_PROFILES.find(p => p.id === userId);
    if (target) {
      setUser(target);
      localStorage.setItem('wl_current_user', JSON.stringify(target));
      const sites = await dataStore.getUserSites(target.id);
      setAccessibleSites(sites);
      if (sites.length > 0) {
        setCurrentRole(sites[0].role);
      }
    }
    setIsLoading(false);
  };

  const hasRole = (allowedRoles: Role[]): boolean => {
    if (!currentRole) return false;
    if (currentRole === 'owner') return true;
    if (currentRole === 'admin' && allowedRoles.includes('admin')) return true;
    return allowedRoles.includes(currentRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentRole,
        accessibleSites,
        isLoading,
        login,
        logout,
        switchUser,
        hasRole,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
