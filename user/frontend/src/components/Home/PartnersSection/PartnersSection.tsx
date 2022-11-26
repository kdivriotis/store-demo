import { FC, useRef, useState, useEffect } from "react";
import classNames from "classnames";
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";

import { LoadingSpinner } from "../..";

import { PartnerBrief } from "../../../interfaces/Partner";
import { useHttp } from "../../../hooks";

import SectionHeader from "../../SectionHeader/SectionHeader";
import PartnerCard from "./PartnerCard";

import styles from "./PartnersSection.module.css";

interface ApiResponse {
  partners: PartnerBrief[];
}

const PartnersSection: FC = () => {
  const { isLoading, error, sendRequest } = useHttp();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [partners, setPartners] = useState<PartnerBrief[]>([]);

  const scrollImage = (direction: string) => {
    const { current } = scrollRef;
    if (!current) return;

    if (direction === "left") {
      current.scrollLeft -= 262;
    } else {
      current.scrollLeft += 262;
    }
  };

  // Get all partners from API and set state
  const getPartners = () => {
    // transform API response
    const transformResponse = (response: ApiResponse) => {
      setPartners(response.partners);
    };

    // send GET request to API's route /partner
    const url = `${process.env.REACT_APP_API_URL}/partner`;
    sendRequest({ url, method: "GET" }, transformResponse);
  };

  useEffect(() => {
    getPartners();
  }, []);

  let content = (
    <div className={styles["spinner"]}>
      <LoadingSpinner />
    </div>
  );

  if (!isLoading && error && error.trim() !== "") {
    content = (
      <div className="section-padding">
        <p className="text-error">{error}</p>
      </div>
    );
  } else if (!isLoading && (!partners || partners.length === 0)) {
    return <></>;
  } else if (!isLoading) {
    content = (
      <div className={classNames(styles["partners-section_container"])}>
        <div
          ref={scrollRef}
          className={classNames(styles["partners-section_container_images"])}
        >
          {partners.map((partner, idx) => (
            <PartnerCard
              key={`partner-${idx}`}
              info={partner}
              isLast={idx === partners.length - 1}
            />
          ))}
        </div>

        <div
          className={classNames(styles["partners-section_container_arrows"])}
        >
          <BsArrowLeftShort
            className={classNames(
              styles["partners-section_container_arrows_icon"]
            )}
            onClick={() => scrollImage("left")}
          />
          <BsArrowRightShort
            className={classNames(
              styles["partners-section_container_arrows_icon"]
            )}
            onClick={() => scrollImage("right")}
          />
        </div>
      </div>
    );
  }

  return (
    <section
      id="partners"
      className={classNames(styles["partners-section"], "section-padding")}
    >
      <SectionHeader text="ΣΥΝΕΡΓΑΖΟΜΕΝΑ ΚΑΤΑΣΤΗΜΑΤΑ" />
      {content}
    </section>
  );
};

export default PartnersSection;
