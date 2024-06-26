import React from "react";
import { Navbar, Nav, NavDropdown, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as routes from "../constants/routes";
import SignOutButton from "./SignOut";
import { auth } from "../firebase/firebase";
import cardDetails from "./CardDetails";

function NavigationEmpty() {
  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        width: "100%",
        zIndex: "99",
      }}
    >
      <Navbar className="header" collapseOnSelect expand="lg" variant="dark">
        <Navbar.Brand>
            <img src="./guru.png" alt="Branda Logo" height={"70px"} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
         
        
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

export default NavigationEmpty;
