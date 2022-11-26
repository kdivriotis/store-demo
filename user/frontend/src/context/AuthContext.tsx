import { FC, ReactElement, createContext, useState } from "react";
import { calculateRemainingTime } from "../utils/time";

import { AuthContextState, AuthContextType } from "../interfaces/AuthContext";

interface AuthProviderProps {
  children: ReactElement | ReactElement[];
}

export const AuthContext = createContext<AuthContextType | null>(null);

// initial auth data - get from local storage
let initToken: string | null = localStorage.getItem("token");
const initExpTime: string | null = localStorage.getItem("expirationTime");

if (initExpTime && initToken) {
  // if remaining time until token expiration is less than 1 minute initially, logout the user
  if (calculateRemainingTime(initExpTime) <= 60000) {
    initToken = null;
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
  }
}
// either token or expiration time is not saved
else {
  initToken = null;
  localStorage.removeItem("token");
  localStorage.removeItem("expirationTime");
}

// initially: isLoggedIn if token exists and expiration time is valid
const initIsLoggedIn: boolean = !!initToken;

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthContextState>({
    isLoggedIn: initIsLoggedIn,
    token: initToken,
    expirationTime: initExpTime,
    email: null,
    name: null,
    storeName: null,
    emailVerified: false,
    isVerified: false,
  });

  /**
   * Login action: Update all data in state and save to local storage
   * @param {string} token Successful login's returned token
   * @param {number} expiresIn Token's expiration time in seconds
   * @param {string} email Partner's email address
   * @param {string} name Partner's name
   * @param {string} storeName Partner store's name
   * @param {boolean} emailVerified Partner has verified his email address
   * @param {boolean} isVerified Partner is verified from the administrator
   */
  const login = (
    token: string,
    expiresIn: number,
    email: string,
    name: string,
    storeName: string,
    emailVerified: boolean,
    isVerified: boolean
  ) => {
    // Calculate expiration date/time from now + expiresIn seconds
    const expirationTimeDate: Date = new Date(
      new Date().getTime() + expiresIn * 1000
    );
    const expirationTime: string = expirationTimeDate.toISOString();
    setAuth({
      isLoggedIn: true,
      token,
      expirationTime,
      email,
      name,
      storeName,
      emailVerified,
      isVerified,
    });

    // save values to local storage
    localStorage.setItem("token", token);
    localStorage.setItem("expirationTime", expirationTime);
  };

  /**
   * Logout action: Clean all data in state and remove from local storage
   */
  const logout = () => {
    setAuth({
      isLoggedIn: false,
      token: null,
      expirationTime: null,
      email: null,
      name: null,
      storeName: null,
      emailVerified: false,
      isVerified: false,
    });

    // save values to local storage
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
  };

  /**
   * Set all basic info
   * @param {string} email Partner's email address
   * @param {string} name Partner's name
   * @param {string} storeName Partner store's name
   * @param {boolean} emailVerified Partner has verified his email address
   * @param {boolean} isVerified Partner is verified from the administrator
   */
  const setState = (
    email: string,
    name: string,
    storeName: string,
    emailVerified: boolean,
    isVerified: boolean
  ) => {
    setAuth((prev) => {
      return {
        ...prev,
        email,
        name,
        storeName,
        emailVerified,
        isVerified,
      };
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, setState }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
