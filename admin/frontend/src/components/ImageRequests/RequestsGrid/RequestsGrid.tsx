import { FC, useContext } from "react";

import { useHttp } from "../../../hooks";

import { AuthContext } from "../../../context";
import { AuthContextType } from "../../../interfaces/AuthContext";

import { RequestCard } from "../";

interface PartnerImageRequest {
  id: string;
  storeName: string;
  imageUrl: string | undefined | null;
  pendingImageUrl: string;
}

interface RequestsGridProps {
  requests: PartnerImageRequest[];
  onRefresh: () => void;
}

interface ApiResponse {
  message: string;
}

const RequestsGrid: FC<RequestsGridProps> = ({ requests, onRefresh }) => {
  const { auth } = useContext(AuthContext) as AuthContextType;
  const { isLoading, error, sendRequest } = useHttp();

  const acceptImageHandler = (id: string) => {
    // transform API response
    const transformResponse = (response: ApiResponse) => {
      onRefresh();
    };

    const url = `${process.env.REACT_APP_API_URL}/admin/partner/image-requests/accept/${id}`;

    sendRequest({ url, method: "PATCH", token: auth.token }, transformResponse);
  };

  const rejectImageHandler = (id: string) => {
    // transform API response
    const transformResponse = (response: ApiResponse) => {
      onRefresh();
    };

    const url = `${process.env.REACT_APP_API_URL}/admin/partner/image-requests/reject/${id}`;

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
            imageUrl={req.imageUrl}
            pendingImageUrl={req.pendingImageUrl}
            onAccept={acceptImageHandler}
            onReject={rejectImageHandler}
            isLoading={isLoading}
          />
        ))}
    </div>
  );
};

export default RequestsGrid;
