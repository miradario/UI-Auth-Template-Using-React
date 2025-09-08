import React from 'react'
import { auth } from '../firebase'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { Constants } from '../constants/constants'

const SignOutButton = () => {
  const handleSignOut = () => {
    localStorage.removeItem('email')
    auth.doSignOut()
  }
  return (
    <Link color='info' to={Constants.ROUTES.LANDING} onClick={handleSignOut}>
      <Button style={{ backgroundColor: 'gray' }}>Sign Out</Button>
    </Link>
  )
}

export default SignOutButton
