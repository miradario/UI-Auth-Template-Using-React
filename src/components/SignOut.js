import React from 'react'
import { auth } from '../firebase'
import { Link } from 'react-router-dom'
import * as routes from '../constants/routes'
import { Button } from 'react-bootstrap'

const SignOutButton = () => {
  const handleSignOut = () => {
    localStorage.removeItem('email')
    auth.doSignOut()
  }
  return (
    <Link color='info' to={routes.LANDING} onClick={handleSignOut}>
      <Button style={{ backgroundColor: 'gray' }}>Sign Out</Button>
    </Link>
  )
}

export default SignOutButton
