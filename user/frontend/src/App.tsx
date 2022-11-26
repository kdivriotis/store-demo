import { FC, useContext, useEffect, lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import { AuthContext } from "./context";
import { AuthContextType } from "./interfaces/AuthContext";

import { calculateRemainingTime, setLargeTimeout } from "./utils/time";
import { useHttp } from "./hooks";

import { ScrollToTop } from "./components";
import {
  //   Home,
  //   About,
  //   Menu,
  //   Login,
  //   Register,
  //   ForgotPassword,
  //   VerifyEmail,
  //   Profile,
  //   News,
  //   Order,
  //   Cart,
  Loading,
} from "./pages";

import {
  PersonalInfo,
  StoreInfo,
  ChangePassword,
  ChangePicture,
  OrderHistory,
  OrderDetails,
} from "./components/Profile";
import { AllNews, NewsDetails } from "./components/News";

const Home = lazy(() => import("./pages/Home/Home"));
const About = lazy(() => import("./pages/About/About"));
const Menu = lazy(() => import("./pages/Menu/Menu"));
const Login = lazy(() => import("./pages/Login/Login"));
const Register = lazy(() => import("./pages/Register/Register"));
const ForgotPassword = lazy(
  () => import("./pages/ForgotPassword/ForgotPassword")
);
const VerifyEmail = lazy(() => import("./pages/VerifyEmail/VerifyEmail"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const News = lazy(() => import("./pages/News/News"));
const Order = lazy(() => import("./pages/Order/Order"));
const Cart = lazy(() => import("./pages/Cart/Cart"));

interface ApiResponse {
  token: string;
  expiresIn: number;
  email: string;
  name: string;
  storeName: string;
  emailVerified: boolean;
  isVerified: boolean;
}

const App: FC = () => {
  const { auth, login, logout } = useContext(AuthContext) as AuthContextType;
  const { isLoading, error, sendRequest, resetState } = useHttp();

  if (!isLoading && error) {
    alert(error);
    resetState();
  }

  // On first run: If user is logged in get info and refresh token
  useEffect(() => {
    if (!auth.isLoggedIn || !auth.token || !auth.expirationTime) return;

    // transform API response
    const transformResponse = (response: ApiResponse) => {
      login(
        response.token,
        response.expiresIn,
        response.email,
        response.name,
        response.storeName,
        response.emailVerified,
        response.isVerified
      );
    };

    // send GET request to API's route /partner/info
    const url = `${process.env.REACT_APP_API_URL}/partner/info`;
    sendRequest({ url, method: "GET", token: auth.token }, transformResponse);
  }, []);

  useEffect(() => {
    // Timer: Automatically logout user after the token has expired
    let autoLogoutTimer: ReturnType<typeof setTimeout> | null = null;

    // if user is logged in and expiration time is set and valid, start the timeout to auto-logout:
    if (auth.isLoggedIn && auth.expirationTime) {
      const remainingTime = calculateRemainingTime(auth.expirationTime);
      if (autoLogoutTimer) clearTimeout(autoLogoutTimer);
      autoLogoutTimer = setLargeTimeout(logout, remainingTime);
    }
    // if user is not logged in or expiration time is invalid, reset the running timer (if any)
    else if (autoLogoutTimer) {
      clearTimeout(autoLogoutTimer);
    }
  }, [auth.isLoggedIn, auth.expirationTime, logout]);

  return (
    <Suspense fallback={<Loading />}>
      {/* <ScrollToTop> */}
      {
        // Full access: Logged in and Verified
        auth.isLoggedIn && auth.isVerified ? (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/order" element={<Order />} />
            {/* <Route path="/diy" element={<Diy />} /> */}
            <Route path="/profile" element={<Profile />}>
              <Route path="" element={<PersonalInfo />} />
              <Route path="store" element={<StoreInfo />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="change-picture" element={<ChangePicture />} />
              <Route path="orders/:orderId" element={<OrderDetails />} />
              <Route path="orders" element={<OrderHistory />} />
              <Route path="*" element={<Navigate to="/profile" replace />} />
            </Route>
            <Route path="/news" element={<News />}>
              <Route path="" element={<AllNews />} />
              <Route path=":linkTitle" element={<NewsDetails />} />
              <Route path="*" element={<Navigate to="/news" replace />} />
            </Route>
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/verify-email/:vat/:hash"
              element={<Navigate to="/profile" replace />}
            />
            <Route path="/login" element={<Navigate to="/profile" replace />} />
            <Route
              path="/register"
              element={<Navigate to="/profile" replace />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        ) : // Logged in and email is Verified
        auth.isLoggedIn && auth.emailVerified ? (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/profile" element={<Profile />}>
              <Route path="" element={<PersonalInfo />} />
              <Route path="store" element={<StoreInfo />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="change-picture" element={<ChangePicture />} />
              <Route path="*" element={<Navigate to="/profile" replace />} />
            </Route>
            <Route path="/news" element={<News />}>
              <Route path="" element={<AllNews />} />
              <Route path=":linkTitle" element={<NewsDetails />} />
              <Route path="*" element={<Navigate to="/news" replace />} />
            </Route>
            <Route
              path="/verify-email/:vat/:hash"
              element={<Navigate to="/profile" replace />}
            />
            <Route path="/login" element={<Navigate to="/profile" replace />} />
            <Route
              path="/register"
              element={<Navigate to="/profile" replace />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        ) : // Logged in and email is not Verified
        auth.isLoggedIn ? (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/profile" element={<Profile />}>
              <Route path="" element={<PersonalInfo />} />
              <Route path="store" element={<StoreInfo />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="change-picture" element={<ChangePicture />} />
              <Route path="*" element={<Navigate to="/profile" replace />} />
            </Route>
            <Route path="/news" element={<News />}>
              <Route path="" element={<AllNews />} />
              <Route path=":linkTitle" element={<NewsDetails />} />
              <Route path="*" element={<Navigate to="/news" replace />} />
            </Route>
            <Route path="/verify-email/:vat/:hash" element={<VerifyEmail />} />
            <Route path="/login" element={<Navigate to="/profile" replace />} />
            <Route
              path="/register"
              element={<Navigate to="/profile" replace />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        ) : (
          // Not logged in
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/news" element={<News />}>
              <Route path="" element={<AllNews />} />
              <Route path=":linkTitle" element={<NewsDetails />} />
              <Route path="*" element={<Navigate to="/news" replace />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-email/:vat/:hash" element={<VerifyEmail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )
      }
      {/*</ScrollToTop> */}
    </Suspense>
  );
};

export default App;
