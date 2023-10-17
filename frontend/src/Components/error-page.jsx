import React from "react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.log('error=', isRouteErrorResponse(error));
  return (
    <div>
      <p style={{color: "red", fontSize:"30px"}}>
         404 Page Not Found
      </p>
    </div>
  );
}