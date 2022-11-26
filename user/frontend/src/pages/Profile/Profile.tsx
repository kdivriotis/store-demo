import { FC, useContext, useState, useEffect, useMemo } from "react";
import { Link, Outlet, useOutletContext, useLocation } from "react-router-dom";
import { AiFillEdit } from "react-icons/ai";
import classNames from "classnames";

import { Navbar } from "../../components";

import { PartnerProfile } from "../../interfaces/Partner";
import { useHttp } from "../../hooks";

import { AuthContext } from "../../context";
import { AuthContextType } from "../../interfaces/AuthContext";

import styles from "./Profile.module.css";

enum ActiveLink {
  PersonalInfo = 0,
  StoreInfo = 1,
  ChangePassword = 2,
  OrderHistory = 3,
}

type ContextType = {
  profile: PartnerProfile | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
};

const Profile: FC = () => {
  const { auth, setState, logout } = useContext(AuthContext) as AuthContextType;
  const { isLoading, error, sendRequest } = useHttp();

  const [profile, setProfile] = useState<PartnerProfile | null>(null);

  const location = useLocation();
  const selected: ActiveLink | null = useMemo(() => {
    let regex: RegExp = /^\/profile\/store/;
    if (regex.test(location.pathname)) return ActiveLink.StoreInfo;

    regex = /^\/profile\/change-password/;
    if (regex.test(location.pathname)) return ActiveLink.ChangePassword;

    regex = /^\/profile\/orders/;
    if (regex.test(location.pathname)) return ActiveLink.OrderHistory;

    if (location.pathname === "/profile") return ActiveLink.PersonalInfo;

    return null;
  }, [location]);

  // Get profile info from API and set state
  const getProfileInfo = () => {
    // transform API response
    const transformResponse = (response: PartnerProfile) => {
      setProfile({ ...response });

      // set the auth context's state
      setState(
        response.email,
        response.name,
        response.storeName,
        response.emailVerified,
        response.isVerified
      );
    };

    // send GET request to API's route /partner/profile
    const url = `${process.env.REACT_APP_API_URL}/partner/profile`;
    sendRequest({ url, method: "GET", token: auth.token }, transformResponse);
  };

  // On initial page load, get the profile info
  useEffect(() => getProfileInfo(), []);

  return (
    <div className={classNames(styles["profile-container"])}>
      <Navbar />
      <div className={classNames(styles["profile-container_outter"])}>
        <aside className={classNames(styles["profile-container_sidebar"])}>
          <Link
            to="/profile/change-picture"
            className={classNames(styles["profile-container_sidebar_image"])}
          >
            {isLoading ? (
              <p className="pulse">...</p>
            ) : profile?.imageUrl ? (
              <img src={profile?.imageUrl} alt="Επιλεγμένη εικόνα" />
            ) : (
              <p>Δεν υπάρχει εικόνα</p>
            )}
            {/* <p>{auth.storeName}</p> */}
            <AiFillEdit />
          </Link>
          <div
            className={classNames(styles["profile-container_sidebar_links"])}
          >
            <Link
              to="/profile"
              className={
                selected === ActiveLink.PersonalInfo
                  ? classNames(styles["profile-container_sidebar_link_active"])
                  : classNames(styles["profile-container_sidebar_link"])
              }
            >
              Προσωπικές Πληροφορίες
            </Link>
            <Link
              to="/profile/store"
              className={
                selected === ActiveLink.StoreInfo
                  ? classNames(styles["profile-container_sidebar_link_active"])
                  : classNames(styles["profile-container_sidebar_link"])
              }
            >
              Πληροφορίες Καταστήματος
            </Link>
            <Link
              to="/profile/orders"
              className={
                selected === ActiveLink.OrderHistory
                  ? classNames(styles["profile-container_sidebar_link_active"])
                  : classNames(styles["profile-container_sidebar_link"])
              }
            >
              Παραγγελίες
            </Link>
            <Link
              to="/profile/change-password"
              className={
                selected === ActiveLink.ChangePassword
                  ? classNames(styles["profile-container_sidebar_link_active"])
                  : classNames(styles["profile-container_sidebar_link"])
              }
            >
              Αλλαγή Κωδικού Πρόσβασης
            </Link>
            <button
              className={classNames(styles["profile-container_sidebar_btn"])}
              onClick={logout}
            >
              ΑΠΟΣΥΝΔΕΣΗ
            </button>
          </div>
        </aside>
        <div className={classNames(styles["profile-container_inner"])}>
          <Outlet
            context={{ profile, isLoading, error, onRefresh: getProfileInfo }}
          />
        </div>
      </div>
    </div>
  );
};

export const useProfile = () => useOutletContext<ContextType>();

export default Profile;
