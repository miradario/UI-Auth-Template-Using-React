import React from 'react'
import { withRouter } from 'react-router-dom'
import AuthUserContext from './AuthUserContext'
import { firebase } from '../firebase'
import { Constants } from '../constants/constants'

const withAuthorization = authCondition => Component => {
  class WithAuthorization extends React.Component {
    componentDidMount () {
      firebase.auth.onAuthStateChanged(authUser => {
        if (!authCondition(authUser)) {
          //if the authorization fails, redirects to sign in page
          localStorage.removeItem('email')
          this.props.history.push(Constants.ROUTES.SIGN_IN)
        }
      })
    }

    render () {
      return (
        <AuthUserContext.Consumer>
          {/* it either renders the passed component or not */}
          {authUser =>
            authUser ? (
              <Component {...this.props} loggedUser={authUser} />
            ) : null
          }
        </AuthUserContext.Consumer>
      )
    }
  }

  return withRouter(WithAuthorization) //using withRouter so we have access to history props
}

export default withAuthorization
