import { FC, useContext } from "react";
import classNames from "classnames";

import { PartnerCard } from "../index";
import { PartnerBrief } from "../../../interfaces/Partner";
import { useHttp } from "../../../hooks";

import { AuthContext } from "../../../context";
import { AuthContextType } from "../../../interfaces/AuthContext";

import styles from "./PartnersGrid.module.css";

interface PartnersGridProps {
  partners: PartnerBrief[];
  onRefresh: () => void;
}

const PartnersGrid: FC<PartnersGridProps> = ({ partners, onRefresh }) => {
  const { auth } = useContext(AuthContext) as AuthContextType;
  const { isLoading, error, sendRequest } = useHttp();

  // Delete a partner from API and refresh the partners data
  const deletePartner = (id: string) => {
    if (!id || id.trim() === "") return;

    // transform API response
    const transformResponse = () => {
      onRefresh();
    };

    // send DELETE request to API's route /partner/delete/:id
    const url = `${process.env.REACT_APP_API_URL}/admin/partner/delete/${id}`;
    sendRequest(
      { url, method: "DELETE", token: auth.token },
      transformResponse
    );
  };

  return (
    <>
      {error && error.trim() !== "" && <h2 className="text-error">{error}</h2>}
      <div className={classNames(styles["partners_container_grid"])}>
        {partners.map((partner, idx) => (
          <PartnerCard
            key={`partner-${idx}`}
            partner={partner}
            isLoading={isLoading}
            onDelete={deletePartner}
          />
        ))}
      </div>
    </>
  );
};

export default PartnersGrid;
