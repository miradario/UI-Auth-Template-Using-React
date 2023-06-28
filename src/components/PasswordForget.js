import React, { Component } from 'react'

import { Button, Form, InputGroup, Container } from 'react-bootstrap'
import Footer from './Footer'
import NavigationEmpty from './NavigationEmpty'
import { auth } from '../firebase'

//it resets your password. It doesn’t matter if you are authenticated or not
const PasswordForgetPage = () => {
  return (
    <div className='div-flex'>
      <NavigationEmpty />
      <center style={{ marginTop: '110px' }}>
        <PasswordForgetForm />
        <br />
      </center>
      <Footer />
    </div>
  )
}

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value
})

//################### PasswordForget Form ###################
const INITIAL_STATE = {
  password: '',
  email: '',
  sendMailExpiro: false,
  loading: false
}

class PasswordForgetForm extends Component {
  state = { ...INITIAL_STATE, expiro: false }

  resetPassword = (oobCode, newPassword) => {
    // [START auth_reset_password]
    this.setState({ loading: true })
    auth
      .verifyPasswordResetCode(oobCode)
      .doPasswordSet(oobCode, newPassword)
      .then(function (resp) {
        // Password reset has been confirmed and new password updated.
        alert('Contraseña correctamente ingresada')
        window.location.href = 'http://cursos.elartedevivir.org/app'
        console.log(resp)
        this.setState({ loading: false })
      })
      .catch(function (error) {
        // Error occurred during confirmation. The code might have expired or the
        // password is too weak.
        alert(error.message)
        this.setState({ expiro: true, loading: false })
      })
    // [END auth_reset_password]
  }

  onSubmit = event => {
    event.preventDefault()
    const { password } = this.state
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const oobCode = urlParams.get('oobCode')
    console.log(oobCode)
    this.resetPassword(oobCode, password)
    this.setState({ ...INITIAL_STATE })
    console.log(queryString, urlParams, oobCode, password)
  }

  // check if action code in expired
  componentDidMount () {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const oobCode = urlParams.get('oobCode')
    console.log(oobCode)
    auth
      .verifyPasswordResetCode(oobCode)
      .then(function (email) {
        // alert('email valido', email)
        console.log('Email valido')
      })
      .catch(error => {
        // Invalid or expired action code. Ask user to try to reset the password
        // again.
        console.log('EXPIRO')
        this.setState({ expiro: true })
        // alert('expiro?', error)
        //window.location.href = "http://cursos.elartedevivir.org/app";
      })
  }

  render () {
    const { password } = this.state
    // get query string from url

    const handleSubmit = e => {
      e.preventDefault()
      this.setState({ sendMailExpiro: true })
      auth.doPasswordReset(this.state.email)
      //console.log(this.state.email)
    }

    return (
      <div className='inputclass'>
        <Container style={{ marginBottom: '150px' }}>
          {this.state.expiro ? (
            <div>
              <p
                style={{
                  fontSize: '30px',
                  fontWeight: 'bold',
                  letterSpacing: '2px'
                }}
              >
                El link expiro!
              </p>
              <br />
              <p id='mytextp' style={{ fontSize: '20px' }}>
                Por favor ingrese el email y va recibir un nuevo mail con un
                link tiene una hora para ingresar.
              </p>
              {!this.state.sendMailExpiro ? (
                <form className='newPassword'>
                  <input
                    type='email'
                    placeholder='Ingrese su mail'
                    onChange={e => this.setState({ email: e.target.value })}
                    style={{
                      width: '200px',
                      marginRight: '15px',
                      padding: '8px'
                    }}
                  />
                  <input
                    type='submit'
                    value='Enviar'
                    onClick={handleSubmit}
                    style={{
                      border: 'none',
                      backgroundColor: '#d39e00',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      padding: '8px'
                    }}
                  />{' '}
                </form>
              ) : (
                <p
                  style={{
                    fontSize: '17px',
                    textAlign: 'center',
                    marginTop: '10px'
                  }}
                >
                  Email enviado, por favor revise su casilla o spam!
                </p>
              )}

              <br />
            </div>
          ) : (
            <>
              <h2 id='mytexth2'>Establecer contraseña</h2>
              <Form onSubmit={this.onSubmit}>
                <InputGroup>
                  <InputGroup.Prepend className='inputlabel'>
                    Nueva Contraseña
                  </InputGroup.Prepend>
                  <Form.Control
                    type='password'
                    name='password'
                    id='inputtext'
                    placeholder='Ingrese la contraseña nueva, por favor recuerdela'
                    value={password}
                    required
                    onChange={event =>
                      this.setState(byPropKey('password', event.target.value))
                    }
                  />
                </InputGroup>
                <br />
                <div className='text-center'>
                  <Button type='submit' id='mybutton'>
                    Establecer Contraseña
                  </Button>
                </div>
                <br />
              </Form>
            </>
          )}
        </Container>
      </div>
    )
  }
}

export default PasswordForgetPage

export { PasswordForgetForm }
