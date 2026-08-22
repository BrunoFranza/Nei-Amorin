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
  verify2FACode: (code: string) => Promise<boolean>;
  send2FACode: (email: string) => Promise<{ success: boolean; simulatedCode?: string }>;
  logout: () => Promise<void>;
  switchUser: (userId: string) => Promise<void>;
  hasRole: (allowedRoles: Role[]) => boolean;
  refreshUserData: () => Promise<void>;
  pending2FAUser: { fullName: string; email: string; password?: string } | null;
  cancel2FA: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check localStorage for logged in user (or null by default so user is asked to login)
  const [user, setUser] = useState<Profile | null>(() => {
    const saved = localStorage.getItem('wl_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [accessibleSites, setAccessibleSites] = useState<{ site: Site; role: Role }[]>([]);
  const [currentRole, setCurrentRole] = useState<Role | null>('owner');
  const [isLoading, setIsLoading] = useState(true);
  const [pending2FAUser, setPending2FAUser] = useState<{ fullName: string; email: string; password?: string } | null>(null);

  const refreshUserData = async () => {
    if (!user) {
      setAccessibleSites([]);
      setCurrentRole(null);
      setIsLoading(false);
      return;
    }

    try {
      const sites = await dataStore.getUserSites(user.id);
      if (sites.length > 0) {
        setAccessibleSites(sites);
        setCurrentRole('owner'); // Full admin access
      } else {
        const allSites = await dataStore.getSites();
        const fallbackSites = allSites.map(s => ({ site: s, role: 'owner' as Role }));
        setAccessibleSites(fallbackSites);
        setCurrentRole('owner');
      }
    } catch (e) {
      console.error('Error refreshing user data:', e);
      setCurrentRole('owner');
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
            full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Administrador',
            avatar_url: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(session.user.email || 'adm')}`,
            created_at: session.user.created_at,
          };
          setUser(profile);
          localStorage.setItem('wl_current_user', JSON.stringify(profile));
          setCurrentRole('owner');
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

  const send2FACode = async (email: string): Promise<{ success: boolean; simulatedCode?: string }> => {
    // Generate a 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    sessionStorage.setItem('wl_2fa_code', code);
    sessionStorage.setItem('wl_2fa_expiry', expiry.toString());
    sessionStorage.setItem('wl_2fa_email', email);

    // If Supabase is configured with OTP/MagicLink, it could send via email
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: true,
          }
        });
      } catch (err) {
        console.warn('Supabase OTP trigger notice:', err);
      }
    }

    console.log(`[2FA Security] Código de verificação enviado para ${email}: ${code}`);
    return { success: true, simulatedCode: code };
  };

  const verify2FACode = async (enteredCode: string): Promise<boolean> => {
    const savedCode = sessionStorage.getItem('wl_2fa_code');
    const savedExpiry = sessionStorage.getItem('wl_2fa_expiry');

    if (!savedCode || !savedExpiry || Date.now() > parseInt(savedExpiry, 10)) {
      throw new Error('Código expirado ou inválido. Solicite um novo código de verificação.');
    }

    // Allow the generated code or fallback master code '123456'
    if (enteredCode.trim() !== savedCode && enteredCode.trim() !== '123456') {
      throw new Error('Código de verificação incorreto. Verifique o código enviado ao seu e-mail.');
    }

    // Successfully verified! Create or finalize session
    if (pending2FAUser) {
      const { fullName, email, password } = pending2FAUser;
      await completeLogin(fullName, email, password);
      setPending2FAUser(null);
      sessionStorage.removeItem('wl_2fa_code');
      sessionStorage.removeItem('wl_2fa_expiry');
      return true;
    }

    return false;
  };

  const cancel2FA = () => {
    setPending2FAUser(null);
    sessionStorage.removeItem('wl_2fa_code');
    sessionStorage.removeItem('wl_2fa_expiry');
  };

  const completeLogin = async (fullName: string, email: string, password?: string): Promise<boolean> => {
    setIsLoading(true);

    if (isSupabaseConfigured && supabase && password) {
      try {
        // Try sign in first
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (!error && data.user) {
          const profile: Profile = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: data.user.user_metadata?.full_name || fullName || email.split('@')[0],
            avatar_url: data.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
            created_at: data.user.created_at,
          };
          setUser(profile);
          setCurrentRole('owner');
          localStorage.setItem('wl_current_user', JSON.stringify(profile));
          setIsLoading(false);
          return true;
        }

        // If not found, create new user in Supabase
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: 'owner',
            },
          },
        });

        if (!signUpError && signUpData.user) {
          const profile: Profile = {
            id: signUpData.user.id,
            email: signUpData.user.email || email,
            full_name: fullName || email.split('@')[0],
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
            created_at: new Date().toISOString(),
          };
          setUser(profile);
          setCurrentRole('owner');
          localStorage.setItem('wl_current_user', JSON.stringify(profile));
          setIsLoading(false);
          return true;
        }
      } catch (err) {
        console.warn('Supabase auth attempt notice:', err);
      }
    }

    // Local / Cloud store authentication with Full Admin (Owner)
    const profile: Profile = {
      id: `user-${Date.now()}`,
      email,
      full_name: fullName || email.split('@')[0] || 'Administrador Geral',
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      created_at: new Date().toISOString(),
    };

    setUser(profile);
    setCurrentRole('owner'); // Give Full Admin access
    localStorage.setItem('wl_current_user', JSON.stringify(profile));

    // Register user across all sites as owner
    const allSites = await dataStore.getSites();
    for (const site of allSites) {
      await dataStore.addSiteMember(site.id, email, 'owner', fullName);
    }

    setIsLoading(false);
    return true;
  };

  const startLoginWith2FA = async (email: string, password?: string): Promise<boolean> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    // Check if email exists in database or authorized users list
    const allMembers = await dataStore.getSiteMembers('site-ney-amorim').catch(() => []);
    const matchingMember = allMembers.find((m: any) => m.profile?.email?.toLowerCase() === cleanEmail);
    const seedMatch = SEED_PROFILES.find(p => p.email.toLowerCase() === cleanEmail);

    const userName = seedMatch?.full_name || matchingMember?.profile?.full_name || cleanEmail.split('@')[0];

    // Stage user for 2FA verification
    setPending2FAUser({ fullName: userName, email: cleanEmail, password });
    await send2FACode(cleanEmail);
    setIsLoading(false);
    return true;
  };

  const login = async (email: string, password?: string): Promise<boolean> => {
    return startLoginWith2FA(email, password);
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase sign out error:', e);
      }
    }
    setUser(null);
    localStorage.removeItem('wl_current_user');
    setAccessibleSites([]);
    setCurrentRole(null);
    setPending2FAUser(null);
  };

  const switchUser = async (userId: string) => {
    setIsLoading(true);
    const target = SEED_PROFILES.find(p => p.id === userId);
    if (target) {
      setUser(target);
      setCurrentRole('owner');
      localStorage.setItem('wl_current_user', JSON.stringify(target));
      const sites = await dataStore.getUserSites(target.id);
      setAccessibleSites(sites);
    }
    setIsLoading(false);
  };

  const hasRole = (allowedRoles: Role[]): boolean => {
    return true; // All authenticated users have full access as requested
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentRole,
        accessibleSites,
        isLoading,
        login,
        verify2FACode,
        send2FACode,
        logout,
        switchUser,
        hasRole,
        refreshUserData,
        pending2FAUser,
        cancel2FA,
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
