import { FC, useState, useEffect, useCallback, useContext } from "react";
import classNames from "classnames";

import { Pagination } from "../../index";
import { PartnersGrid } from "../";

import { PartnerBrief } from "../../../interfaces/Partner";
import { useHttp } from "../../../hooks";

import { AuthContext } from "../../../context";
import { AuthContextType } from "../../../interfaces/AuthContext";

import styles from "./AllPartners.module.css";

enum ActiveLink {
  All = 0,
  Verified = 1,
  NotVerified = 2,
}

interface ApiResponse {
  numberOfPartners: number;
  partners: PartnerBrief[];
}

const partnersPerPage = 9;

const AllPartners: FC = () => {
  const { auth } = useContext(AuthContext) as AuthContextType;
  const { isLoading, error, sendRequest } = useHttp();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [numberOfPartners, setNumberOfPartners] = useState<number>(0);
  const [partners, setPartners] = useState<PartnerBrief[]>([]);
  const [filterVerified, setFilterVerified] = useState<ActiveLink>(
    ActiveLink.All
  );

  // Get all partners from API and set state
  const getPartners = useCallback(() => {
    // transform API response
    const transformResponse = (response: ApiResponse) => {
      const {
        numberOfPartners: responseNumberOfPartners,
        partners: responsePartners,
      } = response;
      setNumberOfPartners(responseNumberOfPartners);
      setPartners(responsePartners);
    };

    // send GET request to API's route /partner/:offset/:limit/:isVerified?
    const isVerified =
      filterVerified === ActiveLink.Verified
        ? "/1"
        : filterVerified === ActiveLink.NotVerified
        ? "/0"
        : "";
    const url = `${process.env.REACT_APP_API_URL}/admin/partner/brief/${
      (currentPage - 1) * partnersPerPage
    }/${partnersPerPage}${isVerified}`;

    sendRequest({ url, method: "GET", token: auth.token }, transformResponse);
  }, [
    currentPage,
    filterVerified,
    setPartners,
    setNumberOfPartners,
    sendRequest,
    auth.token,
  ]);

  useEffect(() => {
    getPartners();
  }, [getPartners]);

  let content = (
    <div className={classNames(styles["spinner"], "spin", "section-padding")}>
      <svg
        role="status"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
    </div>
  );

  if (!isLoading && error && error.trim() !== "") {
    content = (
      <div className="section-padding">
        <p className="text-error">{error}</p>
      </div>
    );
  } else if (!isLoading && (!partners || partners.length === 0)) {
    content = (
      <div className="section-padding">
        <p className="text-error">Δεν υπάρχουν ακόμη συνεργάτες.</p>
      </div>
    );
  } else if (!isLoading) {
    content = <PartnersGrid partners={partners} onRefresh={getPartners} />;
  }

  return (
    <>
      <nav className={styles["partners-navigation"]}>
        <button
          className={
            filterVerified === ActiveLink.All
              ? styles["partners-navigation-link_active"]
              : styles["partners-navigation-link_inactive"]
          }
          onClick={() => setFilterVerified(ActiveLink.All)}
        >
          Όλοι
        </button>
        <button
          className={
            filterVerified === ActiveLink.Verified
              ? styles["partners-navigation-link_active"]
              : styles["partners-navigation-link_inactive"]
          }
          onClick={() => setFilterVerified(ActiveLink.Verified)}
        >
          Επιβεβαιωμένοι
        </button>
        <button
          className={
            filterVerified === ActiveLink.NotVerified
              ? styles["partners-navigation-link_active"]
              : styles["partners-navigation-link_inactive"]
          }
          onClick={() => setFilterVerified(ActiveLink.NotVerified)}
        >
          Μη Επιβεβαιωμένοι
        </button>
      </nav>
      <div className={styles["partners_pagination"]}>
        <Pagination
          itemsPerPage={partnersPerPage}
          totalItems={numberOfPartners}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
      {content}
      <div className={styles["partners_pagination"]}>
        <Pagination
          itemsPerPage={partnersPerPage}
          totalItems={numberOfPartners}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </>
  );
};

export default AllPartners;
