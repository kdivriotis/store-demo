import { FC } from "react";

import { Navbar, SectionDivider, Footer } from "../../components";

import {
  HomeWelcomeSection,
  HomeFindUsSection,
  HomeOurPiesSection,
  HomeMenuSection,
  HomeImageSection,
  HomePartnersSection,
} from "../../components/Home";

const Home: FC = () => {
  return (
    <>
      <Navbar showImage={true} />
      <HomeWelcomeSection />
      <SectionDivider />
      <HomeFindUsSection />
      <HomeOurPiesSection />
      <HomeMenuSection />
      <HomeImageSection />
      <HomePartnersSection />
      <Footer />
    </>
  );
};

export default Home;
