import { FC, useContext, useEffect, lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import { AuthContext } from "./context";
import { AuthContextType } from "./interfaces/AuthContext";

import { calculateRemainingTime, setLargeTimeout } from "./utils/time";
import { useHttp } from "./hooks";

import { Layout } from "./components";
import {
  Loading,
  // Dashboard,
  // News,
  // Login,
  // Partners,
  // UrlRequests,
  // ImageRequests,
  // Products,
  // Orders,
} from "./pages";

import { AllNews, CreatePostForm, EditPostForm } from "./components/News";
import { AllPartners, EditPartner } from "./components/Partners";
import {
  AllProducts,
  DeletedProducts,
  CreateProductForm,
  EditProductForm,
} from "./components/Products";
import { OrdersContainer, OrderDetails } from "./components/Orders";

const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const News = lazy(() => import("./pages/News/News"));
const Login = lazy(() => import("./pages/Login/Login"));
const Partners = lazy(() => import("./pages/Partners/Partners"));
const UrlRequests = lazy(() => import("./pages/UrlRequests/UrlRequests"));
const ImageRequests = lazy(() => import("./pages/ImageRequests/ImageRequests"));
const Products = lazy(() => import("./pages/Products/Products"));
const Orders = lazy(() => import("./pages/Orders/Orders"));

interface ApiResponse {
  token: string;
  expiresIn: number;
}

const App: FC = () => {
  const { auth, login, logout } = useContext(AuthContext) as AuthContextType;
  const { isLoading, error, sendRequest, resetState } = useHttp();

  if (!isLoading && error) {
    alert(error);
    resetState();
  }

  // On first run: If admin is has a saved token check validity and refresh token
  useEffect(() => {
    if (!auth.token || !auth.expirationTime) return;

    // transform API response
    const transformResponse = (response: ApiResponse) => {
      login(response.token, response.expiresIn);
    };

    // send GET request to API's route /admin/refresh-token
    const url = `${process.env.REACT_APP_API_URL}/admin/auth/refresh-token`;
    sendRequest({ url, method: "GET", token: auth.token }, transformResponse); // eslint-disable-next-line
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

  if (isLoading) {
    return (
      <Layout>
        <Routes>
          <Route path="*" element={<Loading />} />
        </Routes>
      </Layout>
    );
  }

  if (!auth.isLoggedIn) {
    return (
      <Layout>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    );
  }

  return (
    <Layout>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/news" element={<News />}>
            <Route path="" element={<AllNews />} />
            <Route path="create" element={<CreatePostForm />} />
            <Route path="edit/:linkTitle" element={<EditPostForm />} />
            <Route path="*" element={<Navigate to="" replace />} />
          </Route>
          <Route path="/partners" element={<Partners />}>
            <Route path="" element={<AllPartners />} />
            <Route path="edit/:partnerId" element={<EditPartner />} />
            <Route path="*" element={<Navigate to="" replace />} />
          </Route>
          <Route path="/url-requests" element={<UrlRequests />} />
          <Route path="/image-requests" element={<ImageRequests />} />
          <Route path="/menu" element={<Products />}>
            <Route path="" element={<AllProducts />} />
            <Route path="create" element={<CreateProductForm />} />
            <Route path="edit/:productId" element={<EditProductForm />} />
            <Route path="deleted" element={<DeletedProducts />} />
            <Route path="*" element={<Navigate to="" replace />} />
          </Route>
          <Route path="/orders" element={<Orders />}>
            <Route path="" element={<OrdersContainer />} />
            <Route path=":orderId" element={<OrderDetails />} />
            <Route path="*" element={<Navigate to="" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default App;
