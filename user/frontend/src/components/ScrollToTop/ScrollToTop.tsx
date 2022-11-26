import { FC, ReactElement, useEffect } from "react";
import { useLocation } from "react-router";

interface ScrollToTopProps {
  children: ReactElement | ReactElement[];
}

const ScrollToTop: FC<ScrollToTopProps> = ({ children }) => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return <>{children}</>;
};

export default ScrollToTop;
