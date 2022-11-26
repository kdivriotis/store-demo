import { FC, useContext } from "react";

import { useHttp } from "../../../hooks";

import { AuthContext } from "../../../context";
import { AuthContextType } from "../../../interfaces/AuthContext";

import { RequestCard } from "../";

interface PartnerUrlRequest {
  id: string;
  storeName: string;
  siteUrl: string;
}

interface RequestsGridProps {
  requests: PartnerUrlRequest[];
  onRefresh: () => void;
}

interface ApiResponse {
  message: string;
}

const RequestsGrid: FC<RequestsGridProps> = ({ requests, onRefresh }) => {
  const { auth } = useContext(AuthContext) as AuthContextType;
  const { isLoading, error, sendRequest } = useHttp();

  const acceptSiteUrlHandler = (id: string) => {
    // transform API response
    const transformResponse = (response: ApiResponse) => {
      onRefresh();
    };

    const url = `${process.env.REACT_APP_API_URL}/admin/partner/link-requests/accept/${id}`;

    sendRequest({ url, method: "PATCH", token: auth.token }, transformResponse);
  };

  const rejectSiteUrlHandler = (id: string) => {
    // transform API response
    const transformResponse = (response: ApiResponse) => {
      onRefresh();
    };

    const url = `${process.env.REACT_APP_API_URL}/admin/partner/link-requests/reject/${id}`;

    sendRequest({ url, method: "PATCH", token: auth.token }, transformResponse);
  };

  return (
    <div className="section-padding">
      {error && error.trim() !== "" && <h2 className="text-error">{error}</h2>}
      {requests &&
        requests.length > 0 &&
        requests.map((req, index) => (
          <RequestCard
            key={`req-${index}-${req.storeName}`}
            id={req.id}
            storeName={req.storeName}
            siteUrl={req.siteUrl}
            onAccept={acceptSiteUrlHandler}
            onReject={rejectSiteUrlHandler}
            isLoading={isLoading}
          />
        ))}
    </div>
  );
};

export default RequestsGrid;
