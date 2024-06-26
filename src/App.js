import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import * as routes from "./constants/routes";
import SignUpPage from "./components/SignUp";
import SignInPage from "./components/SignIn";
import PasswordForgetPage from "./components/PasswordForget";

import LandingPage from "./components/Landing";
import UsersPage from "./components/Users";
import AddUsersPage from "./components/AddUser";
import withAuthentication from "./components/withAuthentication";

const App = () => (
  <BrowserRouter>
    <Route exact path={routes.LANDING} component={LandingPage} />
    <Route exact path={routes.USERS} component={UsersPage} />
    <Route exact path={routes.ADDUSERS} component={AddUsersPage} />
    <Route exact path={routes.SIGN_UP} component={SignUpPage} />
    <Route exact path={routes.SIGN_IN} component={SignInPage} />
    <Route exact path={routes.PASSWORD_FORGET} component={PasswordForgetPage} />

    {/* <Route exact path={routes.HOME} component={HomePage} /> */}
  </BrowserRouter>
);

export default withAuthentication(App);
