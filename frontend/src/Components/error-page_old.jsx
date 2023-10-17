import React from "react";

const error404 = {
  color: "red",
}

export default function ErrorPage() {
  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p style={error404}>!! Error 404 !! </p>
    </div>
  );
}
