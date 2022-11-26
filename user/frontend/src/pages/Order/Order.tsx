import { FC } from "react";

import { Navbar, Footer } from "../../components";
import { ProductsGrid } from "../../components/Order";

const Order: FC = () => {
  return (
    <>
      <Navbar showImage={false} />
      <ProductsGrid />
      <Footer />
    </>
  );
};

export default Order;
