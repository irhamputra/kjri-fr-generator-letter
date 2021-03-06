import * as React from "react";
import Navigation from "../Navigation";

const MainLayout: React.FC = ({ children }) => {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
};

export default MainLayout;
