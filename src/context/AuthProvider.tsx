import { useCallback, useMemo, useState, type ReactNode } from "react";
import { AuthContext, type AuthContextValue, type User } from "./authContext";

const STORAGE_KEY = "policezebra-user";

// TODO: backend. Replace this browser storage with your real session
// (for example a token or cookie, checked when the app loads).
const load = (): User | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const u: unknown = JSON.parse(raw);
    if (u && typeof u === "object" && "email" in u && "phone" in u) {
      return u as User;
    }
    return null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(load);

  const signIn = useCallback((u: User) => {
    setUser(u);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } catch {
      /* storage unavailable: still signed in for this visit */
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, signIn, signOut }),
    [user, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};