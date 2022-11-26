export interface AuthContextState {
  isLoggedIn: boolean;
  token: string | null;
  expirationTime: string | null;
}

export interface AuthContextType {
  auth: AuthContextState;
  login: (token: string, expiresIn: number) => void;
  logout: () => void;
}
