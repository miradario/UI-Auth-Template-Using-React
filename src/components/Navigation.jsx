import React from "react";
import { Navbar, Nav, NavDropdown, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as routes from "../constants/routes";
import SignOutButton from "./SignOut";
import { auth } from "../firebase/firebase";
import cardDetails from "./CardDetails";

function Navigation() {
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
          <Link to={routes.LANDING}>
            <img src="./guru.png" alt="Branda Logo" height={"70px"} />
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            {/*  <NavDropdown
              title={<Button>Features</Button>}
              id="collasible-nav-dropdown"
            >
              {cardDetails.map((oneCard) => (
                <NavDropdown.Item>
                  <Link
                    to={"/card/" + oneCard.url}
                    style={{ color: "black", textDecoration: "none" }}
                  >
                    {oneCard.title}
                  </Link>
                </NavDropdown.Item>
              ))}
            </NavDropdown> */}
            {/*  <Nav.Link to={routes.ACCOUNT}>
              <Button>Users</Button>
            </Nav.Link> */}
            {/* <Nav.Link href="https://code-mergers-org.netlify.app/">
              <Button>About Us</Button>
            </Nav.Link> */}
          </Nav>
          {auth.currentUser === null ? (
            <Nav>
              <Nav.Link>
                <Link to={routes.SIGN_IN} style={{ color: "white" }}>
                  <Button style={{ color: "white", backgroundColor: "gray" }}>
                    SignIn/SignUp
                  </Button>
                </Link>
              </Nav.Link>
            </Nav>
          ) : (
            <Nav>
              <Nav.Link>
                <Link to={routes.USERS} style={{ color: "white" }}>
                  <Button
                    style={{
                      backgroundColor: "white",

                      borderColor: "gray",
                    }}
                  >
                    Users
                  </Button>
                </Link>
              </Nav.Link>
              <Nav.Link>
                <SignOutButton />
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

export default Navigation;
