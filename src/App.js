import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import SignUpPage from './components/SignUp'
import SignInPage from './components/SignIn'
import PasswordForgetPage from './components/PasswordForget'

import LandingPage from './components/Landing'
import UsersPage from './components/Users'
import AddUsersPage from './components/AddUser'
import withAuthentication from './components/withAuthentication'
import { Constants } from './constants/constants'

const App = () => (
  <BrowserRouter>
    <Route exact path={Constants.ROUTES.LANDING} component={LandingPage} />
    <Route exact path={Constants.ROUTES.USERS} component={UsersPage} />
    <Route exact path={Constants.ROUTES.ADDUSERS} component={AddUsersPage} />
    <Route exact path={Constants.ROUTES.SIGN_UP} component={SignUpPage} />
    <Route exact path={Constants.ROUTES.SIGN_IN} component={SignInPage} />
    <Route
      exact
      path={Constants.ROUTES.PASSWORD_FORGET}
      component={PasswordForgetPage}
    />

    {/* <Route exact path={routes.HOME} component={HomePage} /> */}
  </BrowserRouter>
)

export default withAuthentication(App)
