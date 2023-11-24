import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

export const MainPage = () => {
  const location = useLocation();
  //const navigate = useNavigate();

  useEffect(() => {
    //navigate("login", { replace: false });
    console.log("Current location is ", location);
  }, [location]);

  return (
    <>
    888888888888888888888
      <hr />
      <Outlet />
    </>
  );
};
