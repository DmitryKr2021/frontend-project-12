import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export const MainPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Current location is ", location);
  }, [location]);

  return (
    <>
      <nav>
        <ul>
          <li>
            <button onClick={() => navigate("login", { replace: false })}
            style={{
              cursor: "pointer",
            }}
            >
              Login
            </button>
          </li>
        </ul>
      </nav>
      <hr />
      <Outlet />
    </>
  );
};
