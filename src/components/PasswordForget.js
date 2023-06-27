import React, { Component } from 'react'

import { Button, Form, InputGroup, Container } from 'react-bootstrap'
import Footer from './Footer'
import NavigationEmpty from './NavigationEmpty'
import { auth } from '../firebase'

//it resets your password. It doesn’t matter if you are authenticated or not
const PasswordForgetPage = () => (
  <div className='div-flex'>
    <NavigationEmpty />
    <center style={{ marginTop: '110px' }}>
      <PasswordForgetForm />
      <br />
    </center>
    <Footer />
  </div>
)

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value
})

//################### PasswordForget Form ###################
const INITIAL_STATE = {
  password: '',
  email: ''
}

class PasswordForgetForm extends Component {
  state = { ...INITIAL_STATE, expiro: false }

  resetPassword = (oobCode, newPassword) => {
    // [START auth_reset_password]
    auth
      .verifyPasswordResetCode(oobCode)
      .doPasswordSet(oobCode, newPassword)
      .then(function (resp) {
        // Password reset has been confirmed and new password updated.
        alert('Contraseña correctamente ingresada')
        window.location.href = 'http://cursos.elartedevivir.org/app'
        console.log(resp)
      })
      .catch(function (error) {
        // Error occurred during confirmation. The code might have expired or the
        // password is too weak.
        alert(error.message)
        this.setState({ expiro: true })
      })
    // [END auth_reset_password]
  }

  onSubmit = event => {
    const { password } = this.state
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const oobCode = urlParams.get('oobCode')
    console.log(oobCode)
    this.resetPassword(oobCode, password)
    this.setState({ ...INITIAL_STATE })
    event.preventDefault()
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
        alert('email valido', email)
      })
      .catch(function (error) {
        // Invalid or expired action code. Ask user to try to reset the password
        // again.
        this.setState({ expiro: true })
        alert('expiro?', error)
        //window.location.href = "http://cursos.elartedevivir.org/app";
      })
  }

  render () {
    const { password } = this.state
    // get query string from url

    const handleSubmit = () => {
      auth.doPasswordReset(this.state.email)
      //console.log(this.state.email)
    }

    return (
      <div className='inputclass'>
        <Container style={{ marginBottom: '150px' }}>
          <h2 id='mytexth2'>Establecer contraseña</h2>
          {this.state.expiro ? (
            <div>
              <p>El link expiro!</p>
              <br />
              <p id='mytextp'>
                Por favor ingrese el email y va recibir un nuevo mail con un
                link tiene una hora para ingresar.
              </p>
              <form className='newPassword'>
                <input
                  type='email'
                  placeholder='Ingrese su mail'
                  onChange={e => this.setState({ email: e.target.value })}
                />
                <input type='submit' value='Enviar' onClick={handleSubmit} />
              </form>
              <br />
            </div>
          ) : (
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
          )}
        </Container>
      </div>
    )
  }
}

export default PasswordForgetPage

export { PasswordForgetForm }
