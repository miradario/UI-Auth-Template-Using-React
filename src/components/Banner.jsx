import React from "react";
import { Link } from "react-router-dom";
import * as routes from "../constants/routes";

const MainBanner = () => (
  <div style={{ marginTop: "110px", marginBottom: "20px" }}>
    <center>
      <Link to={routes.LANDING}>
        <img src="./CodeMergers-Banner.png" alt="Branda Logo" height={"70px"} />
      </Link>
      <hr />
    </center>
  </div>
);

export default MainBanner;
