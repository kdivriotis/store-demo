import { FC } from "react";
import { Outlet } from "react-router-dom";

import { Navbar, Footer } from "../../components";

const News: FC = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default News;
