export interface AuthContextState {
  isLoggedIn: boolean;
  token: string | null;
  expirationTime: string | null;
  email: string | null;
  name: string | null;
  storeName: string | null;
  emailVerified: boolean;
  isVerified: boolean;
}

export interface AuthContextType {
  auth: AuthContextState;
  login: (
    token: string,
    expiresIn: number,
    email: string,
    name: string,
    storeName: string,
    emailVerified: boolean,
    isVerified: boolean
  ) => void;
  logout: () => void;
  setState: (
    email: string,
    name: string,
    storeName: string,
    emailVerified: boolean,
    isVerified: boolean
  ) => void;
}
