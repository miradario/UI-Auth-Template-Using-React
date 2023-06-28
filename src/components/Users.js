import React, { Component } from 'react'
import Navigation from './Navigation'
import { db, auth } from '../firebase/firebase'
import Footer from './Footer'
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs'
import { read, utils } from 'xlsx'
import { deleteUser, updateKeyUser } from '../helpers/updateKeyUser'

const INITIAL_STATE = {
  error: null
}

class UserPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      itemsFilter: [],
      showDeleted: false,
      showOrder: false,
      orderActive: { active: false, by: '' },
      pagination: {},
      showPagination: false,
      selectedToAuthenticated: []
    }
  }

  //delete auth user from firebase
  deleteAuthUser = (id, status) => {
    db.ref('users/' + id).update({
      inactive: status
    })
    alert('User status changed')
    window.location.reload(false)
  }

  getData () {
    db.ref('users/').on('value', snapshot => {
      let items = snapshot.val()
      let newState = []
      for (let item in items) {
        newState.push({
          id: item,
          name: items[item].name,
          lastName: items[item].lastName,
          email: items[item].email,
          phone: items[item].phone,
          country: items[item].country,
          code: items[item].code,
          TTCDate: items[item].TTCDate,
          sign: items[item].sign,

          address: items[item].address,
          inactive: items[item].inactive
        })
      }
      this.setState({
        items: newState
      })
    })
  }

  handleFilterDeleted = () => {
    this.setState({ showDeleted: !this.state.showDeleted })
  }

  componentDidMount () {
    // db ref user order by name

    db.ref('users/')

      .once('value')
      .then(snapshot => {
        // console.log('snapshot:', snapshot)
        if (snapshot) {
          this.setState({
            items: Object.entries(snapshot.val()),
            itemsFilter: Object.entries(snapshot.val()),
            pagination: {
              page: 0,
              perPage: 25,
              totalPages:
                Math.floor(Object.entries(snapshot.val()).length / 25) !=
                Object.entries(snapshot.val()).length / 25
                  ? Math.floor(Object.entries(snapshot.val()).length / 25)
                  : Object.entries(snapshot.val()).length / 25 - 1
            }
          })
          // console.log('items:', this.state.items)
          //order by this.state.item by email name
          //   this.handleOrderEmail()
        }
      })
      .catch(e => {
        alert(e.message)
      })
  }

  state = { ...INITIAL_STATE }

  render () {
    const orderArray = (array, param) => {
      let min, aux
      for (let i = 0; i < array.length - 1; i++) {
        min = i
        for (let j = i + 1; j < array.length; j++) {
          if (param === 'email') {
            if (
              array[j][1][param].toLowerCase() <
              array[min][1][param].toLowerCase()
            )
              min = j
          } else {
            if (array[j][1][param] < array[min][1][param]) min = j
          }
        }

        if (min !== i) {
          aux = array[i]
          array[i] = array[min]
          array[min] = aux
        }
      }
      return array
    }
    const orderDataByParam = e => {
      const value = e.target.dataset.id
      const order = orderArray([...this.state.items], value)
      this.setState({
        itemsFilter: order,
        orderActive: {
          active: true,
          by: e.target.textContent
        }
      })
    }

    const handlePrevPage = () => {
      if (this.state.pagination.page > 0) {
        this.setState({
          pagination: {
            ...this.state.pagination,
            page: this.state.pagination.page - 1
          }
        })
      }
    }
    const handleNextPage = () => {
      if (this.state.pagination.page !== this.state.pagination.totalPages) {
        this.setState({
          pagination: {
            ...this.state.pagination,
            page: this.state.pagination.page + 1
          }
        })
      }
    }

    const handleOptionPagination = e => {
      const perPageValue = parseInt(e.target.textContent)
      this.setState({
        pagination: {
          page: 0,
          perPage: perPageValue,
          totalPages:
            Math.floor(this.state.items.length / perPageValue) !=
            this.state.items.length / perPageValue
              ? Math.floor(this.state.items.length / perPageValue)
              : this.state.items.length / perPageValue - 1
        }
      })
    }

    const createAuthUser = async email => {
      const userNew = await auth
        .createUserWithEmailAndPassword(email, 'a1b2c3d4e5') //CREA EL USUARIO DE LA AUTENTICACION
        .then(authUser => {
          //save the user id created into the state
          const userNew = authUser.user.uid
          //   console.log('authUser (createAuthUser): ', authUser)
          return userNew
        })
        .catch(error => {
          // setIsLoading(false)
          alert(error.message)
        })
      return userNew
    }

    const handleAuthenticateUser = async (user, actualizar = true) => {
      const keyUserAuth = await createAuthUser(user[1].email)
      //   console.log('USER DATA VIEJA: ', user)
      await updateKeyUser(user[0], keyUserAuth)
      auth.sendPasswordResetEmail(user[1].email)
      if (actualizar) window.location.reload()
    }

    const handleCheckbox = e => {
      const key = e.target.dataset.key

      if (this.state.selectedToAuthenticated.find(el => el[0] == key)) {
        this.setState({
          selectedToAuthenticated: this.state.selectedToAuthenticated.filter(
            el => el[0] != key
          )
        })
        e.target.dataset.active = false
      } else {
        this.setState({
          selectedToAuthenticated: [
            ...this.state.selectedToAuthenticated,
            this.state.itemsFilter.find(el => el[0] == key)
          ]
        })
        e.target.dataset.active = true
      }
    }

    const sendSelected = () => {
      const promises = this.state.selectedToAuthenticated.map(
        async el => await handleAuthenticateUser(el, false)
      )

      Promise.all(promises)
        .then(() => {
          window.location.reload()
        })
        .catch(error => {
          console.log(error)
        })
    }

    // const filterAuths = array =>
    //   array.filter(
    //     el => el[1].authenticated === 1 || el[1].authenticated == undefined
    //   )

    // const filterNoAuths = array => array.filter(el => el[1].authenticated === 0)

    // const deleteDuplicate = async () => {
    //   const arrayAuths = filterAuths([...this.state.itemsFilter])
    //   const arrayNotAuths = filterNoAuths([...this.state.itemsFilter])

    //   //De los que ya estan autenticados (no puede haber dos autenticados con igual mail), cuantos se repiten que no esten autenticados?
    //   //   const repeatsNotAuth = []

    //   //   arrayAuths.forEach(auth => {
    //   //     arrayNotAuths.forEach(notAuth => {
    //   //       if (notAuth[1].email == auth[1].email) repeatsNotAuth.push(notAuth[0])
    //   //     })
    //   //   })

    //   const set = new Set()
    //   const repeats = []
    //   let array
    //   arrayNotAuths.forEach(el => {
    //     set.add(el[1].email)
    //   })
    //   array = [...set]

    //   //Aca en array guardo que emails estan repetidos y cuantas coincidencias hay de ese email
    //   array.forEach(el => {
    //     let count = 0
    //     arrayNotAuths.forEach(element => {
    //       if (el === element[1].email) {
    //         count++
    //       }
    //     })
    //     if (count >= 2) repeats.push({ el, coincidencias: count })
    //   })

    //   //Aca genero un nuevo array que va a tener todos los elementos que se repiten y eliminar el primero de cada uno para borrar los otros dos (consultar porque hay 2 repetidos que tienen igual email pero diferente pais, TTCDate, etc)
    //   let newArray = []

    //   repeats.forEach(el => {
    //     newArray = [
    //       ...newArray,
    //       ...arrayNotAuths
    //         .filter(element => element[1].email == el.el && el.el != '')
    //         .slice(1)
    //     ]
    //   })

    //   newArray.forEach(el =>
    //     console.log(`${el[0]} ||| ${el[1].email} ||| ${el[1].authenticated}`)
    //   )

    //   //   try {
    //   //     const deletePromises = repeatsNotAuth.map(async el => deleteUser(el))

    //   //     await Promise.all(deletePromises)
    //   //     console.log('Todos los usuarios han sido eliminados')
    //   //   } catch (e) {
    //   //     console.log(e)
    //   //   }
    // }

    return (
      <div className='App'>
        <div>
          <Navigation />
          <br />
          <br />
          <br />
          <br />

          <div style={{ width: '100%' }}>
            <div style={{ width: '90%', margin: '0 auto' }}>
              <div style={{ width: '100%' }}>
                <h1 style={{ margin: '20px 0' }}>Teachers</h1>
                <button className='btn btn-primary'>
                  <a href='/add-users' style={{ color: 'white' }}>
                    Add Teacher
                  </a>
                </button>
                <br />
                <br />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: 20
                  }}
                >
                  <button
                    className='btn btn-secondary'
                    onClick={() => this.handleFilterDeleted()}
                  >
                    {!this.state.showDeleted
                      ? 'Show inactive users'
                      : 'Hide inactive users'}
                  </button>

                  <div
                    className='orderContainer'
                    onClick={() =>
                      this.setState({ showOrder: !this.state.showOrder })
                    }
                  >
                    <p>
                      {'Order by ' + this.state.orderActive.by || 'Order by...'}
                    </p>
                    {this.state.showOrder && (
                      <ul className='orderOptions'>
                        {this.state.orderActive.active && (
                          <li
                            className='delete-order'
                            onClick={() =>
                              this.setState({
                                itemsFilter: this.state.items,
                                orderActive: { active: false, by: '' }
                              })
                            }
                          >
                            Eliminar Orden
                          </li>
                        )}
                        <li data-id='name' onClick={orderDataByParam}>
                          Name
                        </li>
                        <li data-id='lastName' onClick={orderDataByParam}>
                          Last Name
                        </li>
                        <li data-id='TTCDate' onClick={orderDataByParam}>
                          First TTC Date
                        </li>
                        <li data-id='country' onClick={orderDataByParam}>
                          Country
                        </li>
                        <li data-id='email' onClick={orderDataByParam}>
                          Email
                        </li>
                        <li data-id='phone' onClick={orderDataByParam}>
                          Phone
                        </li>
                      </ul>
                    )}
                  </div>

                  <div
                    className='orderContainer'
                    onClick={() =>
                      this.setState({
                        showPagination: !this.state.showPagination
                      })
                    }
                  >
                    <p>Por pagina: {this.state.pagination.perPage}</p>
                    {this.state.showPagination && (
                      <ul className='orderOptions'>
                        <li onClick={handleOptionPagination}>25</li>
                        <li onClick={handleOptionPagination}>50</li>
                        <li onClick={handleOptionPagination}>100</li>
                      </ul>
                    )}
                  </div>
                </div>

                {/* BOTON PARA ELIMINAR DUPLICADOS */}
                {/* <button onClick={deleteDuplicate}>DELETE DUPLICATES</button> */}

                {/* PAGINATION */}
                {this.state.items.length > 0 && (
                  <div className='containerBtnPage'>
                    {this.state.pagination.page !== 0 ? (
                      <div
                        className='containerBtnPage__btn'
                        onClick={handlePrevPage}
                      >
                        <BsChevronLeft />
                      </div>
                    ) : (
                      <div
                        className='containerBtnPage__btn'
                        style={{
                          backgroundColor: 'inherit',
                          border: 'none',
                          color: '#a5a5a5'
                        }}
                      >
                        <BsChevronLeft />
                      </div>
                    )}
                    <p>{this.state.pagination.page + 1}</p>
                    {this.state.pagination.page !==
                    this.state.pagination.totalPages ? (
                      <div
                        className='containerBtnPage__btn'
                        onClick={handleNextPage}
                      >
                        <BsChevronRight />
                      </div>
                    ) : (
                      <div
                        className='containerBtnPage__btn'
                        style={{
                          backgroundColor: 'inherit',
                          border: 'none',
                          color: '#a5a5a5'
                        }}
                      >
                        <BsChevronRight />
                      </div>
                    )}
                  </div>
                )}
                {/* PAGINATION CLOSE */}

                <div
                  style={{
                    textAlign: 'right'
                  }}
                >
                  <button
                    style={{
                      backgroundColor:
                        this.state.selectedToAuthenticated?.length > 0
                          ? '#feae00'
                          : '#bbb',
                      padding: '5px 20px',
                      marginBottom: '10px',
                      color:
                        this.state.selectedToAuthenticated?.length > 0
                          ? 'white'
                          : 'black',
                      fontWeight: 'bold'
                    }}
                    onClick={() =>
                      this.state.selectedToAuthenticated.length !== 0
                        ? sendSelected()
                        : console.log('Deshabilitado')
                    }
                  >
                    Send Selected
                  </button>
                </div>
                <table
                  className='table table-striped'
                  style={{ fontSize: '11px' }}
                >
                  <thead>
                    <tr>
                      <th scope='col' data-id='name'>
                        Name
                      </th>
                      <th scope='col' data-id='lastName'>
                        Last Name
                      </th>
                      <th scope='col' data-id='email'>
                        Email
                      </th>
                      <th
                        scope='col'
                        //
                        data-id='phone'
                      >
                        Phone
                      </th>
                      <th scope='col' data-id='country'>
                        Country
                      </th>
                      <th scope='col'>Code</th>
                      <th scope='col'>Long</th>
                      <th scope='col'>Short</th>

                      <th scope='col'>Status</th>
                      <th scope='col' data-id='ttcdate'>
                        First TTC Date
                      </th>
                      <th scope='col'>Sign Contract</th>
                      <th scope='col'>Action</th>
                      <th scope='col'>Delete</th>
                      <th scope='col'>Forgot Password</th>
                      <th scope='col'>Authenticate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.itemsFilter
                      .slice(
                        this.state.pagination.page *
                          this.state.pagination.perPage,
                        (this.state.pagination.page + 1) *
                          this.state.pagination.perPage
                      )
                      .map(user =>
                        //check if inactive y si showDeleted es true
                        (user[1].inactive && this.state.showDeleted) ||
                        !user[1].inactive ? (
                          <tr
                            key={user[0]}
                            style={{
                              backgroundColor: user[1].inactive ? 'orange' : ''
                            }}
                          >
                            <td>{user[1].name}</td>
                            <td>{user[1].lastName}</td>
                            <td>{user[1].email}</td>
                            <td>{user[1].phone}</td>
                            <td>{user[1].country}</td>
                            <td>{user[1].code}</td>
                            <td>{user[1].SKY.long === 1 ? 'On' : 'Off'}</td>
                            <td>{user[1].SKY.short === 1 ? 'On' : 'Off'}</td>
                            <td>{user[1].inactive ? 'Disable' : 'Enable'}</td>
                            <td>{user[1].TTCDate}</td>
                            <td>{user[1].sign === 1 ? 'Yes' : 'No'}</td>
                            <td>
                              <button
                                className='btn btn-primary'
                                style={{
                                  fontSize: '11px'
                                }}
                                onClick={() => {
                                  this.props.history.push({
                                    pathname: '/add-users',
                                    state: { key: user[0] }
                                  })
                                }}
                              >
                                Edit
                              </button>
                            </td>
                            <td>
                              <button
                                style={{
                                  backgroundColor: user[1].inactive
                                    ? ''
                                    : 'orange',
                                  fontSize: '11px'
                                }}
                                className={
                                  user[1].inactive
                                    ? 'btn btn-danger'
                                    : 'btn btn-success'
                                }
                                onClick={() => {
                                  this.deleteAuthUser(
                                    user[0],
                                    !user[1].inactive
                                  )
                                }}
                              >
                                {user[1].inactive ? 'Activate' : 'Inactive'}
                              </button>
                            </td>
                            <td>
                              {/* send a forgot password */}
                              <button
                                className='btn btn-info'
                                style={{ fontSize: 8 }}
                                onClick={() => {
                                  auth
                                    .sendPasswordResetEmail(user[1].email, {
                                      url: 'https://cursos.elartedevivir.org/app'
                                    })
                                    .then(function () {
                                      alert('Password reset email sent')
                                    })
                                    .catch(function (error) {
                                      alert(error.message)
                                    })
                                }}
                              >
                                Reset Password
                              </button>
                            </td>
                            {user[1].authenticated === 0 ? (
                              <td>
                                <button
                                  onClick={() => handleAuthenticateUser(user)}
                                >
                                  Send first mail
                                </button>
                              </td>
                            ) : (
                              <td>Ya autenticado</td>
                            )}
                            <td>
                              {user[1].authenticated === 0 && (
                                <input
                                  type='checkbox'
                                  data-key={user[0]}
                                  data-active={false}
                                  onClick={handleCheckbox}
                                />
                              )}
                            </td>
                          </tr>
                        ) : null
                      )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* PAGINATION */}
          {this.state.items.length > 0 && (
            <div className='containerBtnPage'>
              {this.state.pagination.page !== 0 ? (
                <div className='containerBtnPage__btn' onClick={handlePrevPage}>
                  <BsChevronLeft />
                </div>
              ) : (
                <div
                  className='containerBtnPage__btn'
                  style={{
                    backgroundColor: 'inherit',
                    border: 'none',
                    color: '#a5a5a5'
                  }}
                >
                  <BsChevronLeft />
                </div>
              )}
              <p>{this.state.pagination.page + 1}</p>
              {this.state.pagination.page !==
              this.state.pagination.totalPages ? (
                <div className='containerBtnPage__btn' onClick={handleNextPage}>
                  <BsChevronRight />
                </div>
              ) : (
                <div
                  className='containerBtnPage__btn'
                  style={{
                    backgroundColor: 'inherit',
                    border: 'none',
                    color: '#a5a5a5'
                  }}
                >
                  <BsChevronRight />
                </div>
              )}
            </div>
          )}
          {/* PAGINATION CLOSE */}

          <Footer />
        </div>
      </div>
    )
  }
}

export default UserPage
