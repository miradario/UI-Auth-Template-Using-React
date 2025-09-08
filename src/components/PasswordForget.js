import React, { Component } from 'react'

import { Button, Form, InputGroup, Container } from 'react-bootstrap'
import Footer from './Footer'
import NavigationEmpty from './NavigationEmpty'
import { auth } from '../firebase'
import { languaje } from './languaje/languaje'

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
  loading: false,
  lang: 'ES'
}

class PasswordForgetForm extends Component {
  state = { ...INITIAL_STATE, expiro: false }

  resetPassword = (oobCode, newPassword) => {
    // [START auth_reset_password]
    this.setState({ loading: true })
    auth
      .doPasswordSet(oobCode, newPassword)
      .then(resp => {
        // Password reset has been confirmed and new password updated.
        this.setState({ loading: false })
        alert('Contraseña correctamente ingresada')
        window.location.href = 'http://cursos.elartedevivir.org/app'
        // console.log(resp)
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
    // console.log(oobCode)
    this.resetPassword(oobCode, password)
    this.setState({ ...INITIAL_STATE })
    // console.log(queryString, urlParams, oobCode, password)
  }

  // check if action code in expired
  componentDidMount () {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const oobCode = urlParams.get('oobCode')
    // console.log(oobCode)
    auth
      .verifyPasswordResetCode(oobCode)
      .then(function (email) {
        // alert('email valido', email)
        // console.log('Email valido')
      })
      .catch(error => {
        // Invalid or expired action code. Ask user to try to reset the password
        // again.
        console.error('EXPIRO')
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
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '20px 0'
              }}
            >
              <div
                style={{
                  borderRadius: '2.5px',
                  marginRight: '20px',
                  cursor: 'pointer',
                  padding: 2.5,
                  border:
                    this.state.lang === 'EN' ? '2px solid #d39e00' : 'none'
                }}
              >
                <img
                  src='https://3.bp.blogspot.com/-wjynDks70rs/Wrz-wYUCbKI/AAAAAAAAC9M/JwJXBUEGQ4MCfeupW1LcaHZvVDapvcTQwCLcBGAs/s1600/la-bandera-inglesa.png'
                  alt='English'
                  className='img-lang'
                  onClick={() => this.setState({ lang: 'EN' })}
                />
              </div>
              <div
                style={{
                  borderRadius: '2.5px',
                  marginRight: '20px',
                  cursor: 'pointer',
                  padding: 2.5,
                  border:
                    this.state.lang === 'PR' ? '2px solid #d39e00' : 'none'
                }}
              >
                <img
                  src='http://sooluciona.com/wp-content/uploads/2019/03/bandera-de-brasil.jpg'
                  alt='Portugueis'
                  className='img-lang'
                  onClick={() => this.setState({ lang: 'PR' })}
                />
              </div>
              <div
                style={{
                  borderRadius: '2.5px',
                  marginRight: '20px',
                  cursor: 'pointer',
                  padding: 2.5,
                  border:
                    this.state.lang === 'ES' ? '2px solid #d39e00' : 'none'
                }}
              >
                <img
                  src='http://1.bp.blogspot.com/-iRWQIO19zgQ/T5_35WMscfI/AAAAAAAAAN8/xL0Hm3gy2U0/s1600/ESPA%C3%83%E2%80%98A.jpg'
                  alt='Español'
                  className='img-lang'
                  onClick={() => this.setState({ lang: 'ES' })}
                />
              </div>
            </div>
            {this.state.expiro ? (
              <div>
                <p
                  style={{
                    fontSize: '30px',
                    fontWeight: 'bold',
                    letterSpacing: '2px'
                  }}
                >
                  {languaje.expired[this.state.lang].title}
                </p>
                <br />
                <p id='mytextp' style={{ fontSize: '20px' }}>
                  {languaje.expired[this.state.lang].msg}
                </p>
                {!this.state.sendMailExpiro ? (
                  <form className='newPassword'>
                    <input
                      type='email'
                      placeholder={
                        languaje.expired[this.state.lang].placeholder
                      }
                      onChange={e => this.setState({ email: e.target.value })}
                      style={{
                        width: '200px',
                        marginRight: '15px',
                        padding: '8px'
                      }}
                    />
                    <input
                      type='submit'
                      value={languaje.expired[this.state.lang].btn}
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
                    {languaje.expired[this.state.lang].correct}
                  </p>
                )}

                <br />
              </div>
            ) : (
              <>
                <h2 id='mytexth2'>
                  {languaje.notExpired[this.state.lang].title}
                </h2>
                <Form onSubmit={this.onSubmit}>
                  <InputGroup>
                    <InputGroup.Prepend className='inputlabel'>
                      {languaje.notExpired[this.state.lang].subtitle}
                    </InputGroup.Prepend>
                    <Form.Control
                      type='password'
                      name='password'
                      id='inputtext'
                      placeholder={
                        languaje.notExpired[this.state.lang].placeholder
                      }
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
                      {languaje.notExpired[this.state.lang].btn}
                    </Button>
                  </div>
                  <br />
                  {this.state.loading && (
                    <p>{languaje.notExpired[this.state.lang].loading}...</p>
                  )}
                </Form>
              </>
            )}
          </>
        </Container>
      </div>
    )
  }
}

export default PasswordForgetPage

export { PasswordForgetForm }
