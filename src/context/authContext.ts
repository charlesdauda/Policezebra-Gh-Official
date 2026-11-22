import { createContext } from "react";

export interface User {
  fullName: string;
  email: string;
  phone: string;
}

export interface AuthContextValue {
  user: User | null;
  signIn: (user: User) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);