import { FC, useContext, useState, useEffect } from "react";
import { useParams, useNavigate, NavigateFunction } from "react-router-dom";
import classNames from "classnames";

import { PartnerDetails } from "../../../interfaces/Partner";
import { useHttp } from "../../../hooks";

import { AuthContext } from "../../../context";
import { AuthContextType } from "../../../interfaces/AuthContext";

import { EditPartnerForm, VerifyPartner } from "../";

import styles from "./EditPartner.module.css";

interface DetailsApiResponse {
  partner: PartnerDetails;
}

interface ApiResponse {
  message: string;
}

interface ChangedDetails {
  name: string | undefined;
  surname: string | undefined;
  storeName: string | undefined;
  siteUrl: string | undefined;
  vat: string | undefined;
  doy: string | undefined;
  email: string | undefined;
  phone: string | undefined;
}

const EditPartner: FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const params = useParams();
  const { partnerId } = params;
  const { auth } = useContext(AuthContext) as AuthContextType;
  // useHttp custom hook
  const { isLoading, error, sendRequest } = useHttp();
  const {
    isLoading: changeIsLoading,
    error: changeError,
    sendRequest: changeSendRequest,
  } = useHttp();
  const {
    isLoading: verifyIsLoading,
    error: verifyError,
    sendRequest: verifySendRequest,
  } = useHttp();

  const [partner, setPartner] = useState<PartnerDetails>();

  if (!partnerId || partnerId.trim() === "")
    navigate("/partners", { replace: true });

  // Get partner's details from API and set state
  const getPartnerDetails = () => {
    // transform API response
    const transformResponse = (response: DetailsApiResponse) => {
      setPartner(response.partner);
    };

    // send GET request to API's route /admin/partner/details/:id
    const url = `${process.env.REACT_APP_API_URL}/admin/partner/details/${partnerId}`;

    sendRequest({ url, method: "GET", token: auth.token }, transformResponse);
  };

  useEffect(getPartnerDetails, [partnerId, sendRequest, auth.token]);

  const changePartnersDetails = (newPartner: ChangedDetails) => {
    let isChanged = false;
    for (let newValue in newPartner)
      if (newValue) {
        isChanged = true;
        break;
      }
    if (!isChanged) return;

    // transform API response
    const transformResponse = (response: ApiResponse) => {
      getPartnerDetails();
    };

    // send PATCH request to API's route /admin/partner/change/:id
    const url = `${process.env.REACT_APP_API_URL}/admin/partner/change/${partnerId}`;
    changeSendRequest(
      { url, method: "PATCH", token: auth.token, data: { ...newPartner } },
      transformResponse
    );
  };

  const verifyPartnerHandler = () => {
    // transform API response
    const transformResponse = (response: ApiResponse) => {
      getPartnerDetails();
    };

    // send PATCH request to API's route /admin/partner/verify/:id
    const url = `${process.env.REACT_APP_API_URL}/admin/partner/verify/${partnerId}`;

    verifySendRequest(
      { url, method: "PATCH", token: auth.token },
      transformResponse
    );
  };

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
  } else if (!isLoading && !partner) {
    content = (
      <div className="section-padding">
        <p className="text-error">
          Δεν υπάρχουν στοιχεία για το συνεργάτη που αναζητήσατε, προσπαθήστε
          ξανά.
        </p>
      </div>
    );
  } else if (!isLoading && partner) {
    content = (
      <>
        <EditPartnerForm
          partner={partner}
          isLoading={changeIsLoading}
          error={changeError}
          onSubmit={changePartnersDetails}
        />
        <VerifyPartner
          isVerified={partner.isVerified}
          isEmailVerified={partner.emailVerified}
          onVerify={verifyPartnerHandler}
          isLoading={verifyIsLoading}
          error={verifyError}
        />
      </>
    );
  }

  return (
    <>
      <h1>Επεξεργασία Χρήστη</h1>
      {content}
    </>
  );
};

export default EditPartner;
