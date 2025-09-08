import React, { Component } from 'react'
import { db } from '../firebase/firebase'

class Footer extends Component {
  state = { feedback: '' }

  onSubmit = event => {
    const { feedback } = this.state
    db.ref('feedbacks')
      .push()
      .set({ feedback: feedback })
      .then(() => {
        alert(
          'Thank you so much for taking the time to send us your valuable feedback!'
        )
        this.setState({ feedback: '' })
      })
      .catch(e => {
        alert(e.message)
      })
    event.preventDefault()
  }

  render () {
    return (
      <div id='ourfooter'>
        <br />
        <footer>
          <div className='container-foot'>
            <section className='ft-main'>
              <div id='ourfeedback' className='ft-main-item'>
                <img src='./aoljgd.png' alt='Branda Logo' height={'70px'} />
              </div>
            </section>

            {/*  <section class="ft-social">
              <ul class="ft-social-list">
                <li>
                  <a href="#">
                    <i class="fa fa-facebook"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i class="fa fa-twitter"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i class="fa fa-instagram"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i class="fa fa-github"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i class="fa fa-linkedin"></i>
                  </a>
                </li>
              </ul>
            </section>
            <section class="ft-legal">
              <ul class="ft-legal-list">
                <li>
                  <a href="#">Terms &amp; Conditions</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li style={{ color: "white" }}>
                  &copy; 2021 Copyright Team----------
                </li>
              </ul>
            </section> */}
          </div>
        </footer>
      </div>
    )
  }
}

export default Footer
