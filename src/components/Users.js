import React from 'react'
import Navigation from './Navigation'
import { db, auth } from '../firebase/firebase'
import Footer from './Footer'
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs'
import { MdDelete } from 'react-icons/md'
import { deleteUser, updateKeyUser } from '../helpers/updateKeyUser'
import { useState } from 'react'
import { useEffect } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { ModalFilters } from './Filters/ModalFilters'
import { filterUsers } from '../helpers/filterUsers'

export default function Users () {
  const history = useHistory()
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const email = localStorage.getItem('email')

  const [items, setItems] = useState([])
  const [itemsFilter, setItemsFilter] = useState([])
  const [showDeleted, setShowDeleted] = useState(false)
  const [showOrder, setShowOrder] = useState(false)
  const [pagination, setPagination] = useState({})
  const [perPage, setPerPage] = useState(25)
  const [showPagination, setShowPagination] = useState(false)
  const [selectedToAuthenticated, setSelectedToAuthenticated] = useState([])
  //   const [selectAll, useSelectAll] = useState(false)
  const [valueSearchAux, setValueSearchAux] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const [filtersActive, setFiltersActive] = useState({
    searchValue: '',
    orderActive: {
      active: false,
      by: '',
      value: ''
    },
    filters: {
      active: false,
      name: 'Not selected',
      lastName: 'Not selected',
      email: 'Not selected',
      country: 'Not selected',
      state: 'Not selected',
      TTCDate: 'Not selected',
      phone: 'Not selected',
      teach_country: 'Not selected'
    }
  })

  useEffect(() => {
    let totalPages =
      Math.floor(itemsFilter.length / perPage) != itemsFilter.length / perPage
        ? Math.floor(itemsFilter.length / perPage)
        : itemsFilter.length / perPage - 1

    if (totalPages == -1) totalPages = 0

    setPagination({
      page: totalPages >= pagination.page ? pagination.page : 0,
      perPage: perPage,
      totalPages
    })
  }, [perPage, itemsFilter])

  useEffect(() => {
    if (items.length > 0) {
      let array = [...items]
      //   console.log(filtersActive.filters)
      if (filtersActive.searchValue)
        array = filterDataSearch([...array], filtersActive.searchValue)

      if (filtersActive.orderActive.active)
        array = orderArray([...array], filtersActive.orderActive.value)

      if (filtersActive.filters.active)
        array = filterUsers([...array], filtersActive.filters)

      setItemsFilter(array)
    }
  }, [filtersActive])

  const filterDataSearch = (array, value) => {
    return array?.filter(
      el =>
        el[1].name?.toLowerCase().includes(value) ||
        el[1].email?.toLowerCase().includes(value) ||
        el[1].lastName?.toLowerCase().includes(value)
    )
  }

  const deleteAuthUser = (id, status) => {
    db.ref('users/' + id).update({
      inactive: status
    })
    alert('User status changed')
    window.location.reload(false)
  }

  const getData = () => {
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
      setItems(newState)
    })
  }

  const handleFilterDeleted = () => {
    setShowDeleted(!showDeleted)
  }

  useEffect(() => {
    db.ref('users/')
      .once('value')
      .then(snapshot => {
        if (snapshot) {
          setItems(Object.entries(snapshot.val()))
          setItemsFilter(Object.entries(snapshot.val()))
          setPagination({
            page: 0,
            perPage: perPage,
            totalPages:
              Math.floor(Object.entries(snapshot.val()).length / perPage) !=
              Object.entries(snapshot.val()).length / perPage
                ? Math.floor(Object.entries(snapshot.val()).length / perPage)
                : Object.entries(snapshot.val()).length / perPage - 1
          })
        }
      })
      .catch(e => {
        alert(e.message)
      })
  }, [])

  const orderArray = (array, param) => {
    let min, aux
    // console.log(param, array.length)
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
    // setItemsFilter(order)
    setFiltersActive({
      ...filtersActive,
      orderActive: {
        active: true,
        by: e.target.textContent,
        value
      }
    })
  }

  const handlePrevPage = () => {
    if (pagination.page > 0) {
      setPagination({
        ...pagination,
        page: pagination.page - 1
      })
    }
  }
  const handleNextPage = () => {
    if (pagination.page !== pagination.totalPages) {
      setPagination({
        ...pagination,
        page: pagination.page + 1
      })
    }
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

    if (selectedToAuthenticated.find(el => el[0] == key)) {
      setSelectedToAuthenticated(
        selectedToAuthenticated.filter(el => el[0] != key)
      )
    } else {
      setSelectedToAuthenticated([
        ...selectedToAuthenticated,
        itemsFilter.find(el => el[0] == key)
      ])
    }
  }

  const sendSelected = () => {
    const promises = selectedToAuthenticated.map(
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

  const deleteOneUser = async (key, email) => {
    try {
      const confirm = window.confirm(
        '¿Seguro que desea eliminar el usuario: ' + email + '?'
      )
      if (confirm) {
        const oldUserRef = db.ref('users/' + key)
        await oldUserRef.remove()
        window.location.reload()
      } else {
        window.alert('ELIMINACION CANCELADA')
      }
    } catch (e) {
      console.log(e)
    }
  }

  //   const selectAll = () => {
  //     const notAuth = !selectAll
  //       ? items.filter(el => el[1].authenticated === 0)
  //       : []

  //     this.setState({
  //       selectedToAuthenticated: notAuth
  //       // selectAll: !selectAll
  //     })
  //   }

  /** ==================== BUSCADOR =======================*/

  const handleSearch = e => {
    e.preventDefault()
    const value = valueSearchAux.toLowerCase().trim()
    setFiltersActive({ ...filtersActive, searchValue: value })
  }

  const coursesConcatenate = courses => {
    let coursesString = ''
    courses.forEach((el, i) => {
      if (i == courses.length - 1) {
        alert(el)
        // if content = 'si' then add key to string
        if (el === 'si') coursesString += 'key: ' + i + ', '
      } else {
        coursesString += el + ', '
      }
    })
    return coursesString
  }

  return (
    <div className='App'>
      <div>
        <Navigation />
        <br />
        <br />
        <br />
        <br />

        {email === 'sistemas@elartedevivir.org' ? (
          <>
            <div style={{ width: '100%' }}>
              <div style={{ width: '90%', margin: '0 auto' }}>
                <div style={{ width: '100%' }}>
                  <h1 style={{ margin: '20px 0' }}>Teachers</h1>
                  <form className='formSearch' onSubmit={handleSearch}>
                    <input
                      type='text'
                      placeholder='Nombre, apellido o email...'
                      style={{
                        display: 'block',
                        padding: '8px'
                      }}
                      name='search'
                      value={valueSearchAux}
                      onChange={e => setValueSearchAux(e.target.value)}
                    />
                    <label htmlFor='search'>
                      <AiOutlineSearch />
                    </label>
                    <input
                      type='submit'
                      name='search'
                      id='search'
                      style={{ display: 'none' }}
                    />
                  </form>
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
                      onClick={() => handleFilterDeleted()}
                    >
                      {!showDeleted
                        ? 'Show inactive users'
                        : 'Hide inactive users'}
                    </button>

                    <div
                      className='orderContainer'
                      onClick={() => setShowFilters(true)}
                      style={{
                        backgroundColor: filtersActive.filters.active
                          ? '#feae00'
                          : 'white'
                      }}
                    >
                      <p>
                        Filtro{' '}
                        {filtersActive.filters.active
                          ? `: Activo`
                          : ': Inactivo'}
                      </p>
                    </div>

                    <ModalFilters
                      visible={showFilters}
                      data={items}
                      setShowFilters={setShowFilters}
                      setFiltersActive={setFiltersActive}
                      filtersActive={filtersActive}
                    />

                    <div
                      className='orderContainer'
                      style={{
                        backgroundColor: filtersActive.orderActive.active
                          ? '#feae00'
                          : 'white'
                      }}
                      onClick={() => setShowOrder(!showOrder)}
                    >
                      <p style={{ color: 'black' }}>
                        {'Order by ' + filtersActive.orderActive.by ||
                          'Order by...'}
                      </p>
                      {showOrder && (
                        <ul className='orderOptions'>
                          {filtersActive.orderActive.active && (
                            <li
                              className='delete-order'
                              onClick={() => {
                                setItemsFilter(items)
                                setFiltersActive({
                                  ...filtersActive,
                                  orderActive: {
                                    active: false,
                                    by: '',
                                    value: ''
                                  }
                                })
                              }}
                            >
                              Eliminar Orden: {filtersActive.orderActive.value}
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
                            Origin Country
                          </li>
                          <li
                            data-id='teach_country'
                            onClick={orderDataByParam}
                          >
                            Residence Country
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
                      onClick={() => setShowPagination(!showPagination)}
                    >
                      <p>Por pagina: {perPage}</p>
                      {showPagination && (
                        <ul className='orderOptions'>
                          <li onClick={() => setPerPage(25)}>25</li>
                          <li onClick={() => setPerPage(50)}>50</li>
                          <li onClick={() => setPerPage(100)}>100</li>
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* BOTON PARA ELIMINAR DUPLICADOS */}
                  {/* <button onClick={deleteDuplicate}>DELETE DUPLICATES</button> */}

                  {/* PAGINATION */}
                  {items.length > 0 && (
                    <div className='containerBtnPage'>
                      {pagination.page !== 0 ? (
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
                      <p>{pagination.page + 1}</p>
                      {pagination.page !== pagination.totalPages ? (
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
                      textAlign: 'left'
                    }}
                  >
                    <button
                      style={{
                        backgroundColor:
                          selectedToAuthenticated?.length > 0
                            ? '#feae00'
                            : '#bbb',
                        padding: '5px 20px',
                        marginBottom: '10px',
                        color:
                          selectedToAuthenticated?.length > 0
                            ? 'white'
                            : 'black',
                        fontWeight: 'bold'
                      }}
                      onClick={() =>
                        selectedToAuthenticated.length !== 0
                          ? sendSelected()
                          : console.log('Deshabilitado')
                      }
                    >
                      Send Selected
                    </button>
                    {/* SELECT ALL BUTTON */}
                    {/* <button
                      style={{
                        backgroundColor: '#feae00',
                        padding: '5px 20px',
                        marginBottom: '10px',
                        color: 'black',
                        fontWeight: 'bold',
                        marginLeft: '10px'
                      }}
                      onClick={selectAll}
                    >
                      {selectAll ? 'Uncheck All' : 'Check All'}
                    </button> */}
                  </div>
                  <table
                    className='table table-striped'
                    style={{
                      fontSize: '12px'
                    }}
                  >
                    <thead>
                      <tr>
                        <th scope='col'>Action</th>
                        <th scope='col'>Delete</th>
                        <th scope='col'>Forgot Password</th>
                        <th scope='col'>Authenticate</th>
                        <th scope='col'></th>
                        <th scope='col'>Delete</th>
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
                          Country Origin
                        </th>
                        <th scope='col' data-id='teach_country'>
                          Country Residence
                        </th>
                        <th scope='col'>Code</th>
                        <th scope='col'>Long</th>
                        <th scope='col'>Short</th>

                        <th scope='col'>Status</th>
                        <th scope='col' data-id='ttcdate'>
                          First TTC Date
                        </th>

                        <th scope='col'>Sign Contract</th>
                        <th scope='col'>Comment</th>
                        <th scope='col'>HP</th>
                        <th scope='col'>SSY</th>
                        <th scope='col'>Yes+</th>
                        <th scope='col'>Yes</th>
                        <th scope='col'>AE</th>
                        <th scope='col'>Sahaj</th>
                        <th scope='col'>P2</th>
                        <th scope='col'>SSY2</th>
                        <th scope='col'>DSN</th>
                        <th scope='col'>VTP</th>
                        <th scope='col'>TTC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemsFilter
                        .slice(
                          pagination.page * pagination.perPage,
                          (pagination.page + 1) * pagination.perPage
                        )
                        .map(user =>
                          //check if inactive y si showDeleted es true
                          (user[1].inactive && showDeleted) ||
                          !user[1].inactive ? (
                            <tr
                              key={user[0]}
                              style={{
                                backgroundColor: user[1].inactive
                                  ? 'orange'
                                  : ''
                              }}
                            >
                              <td>
                                <button
                                  className='btn btn-primary'
                                  style={{
                                    fontSize: '11px'
                                  }}
                                  onClick={() => {
                                    history.push({
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
                                    deleteAuthUser(user[0], !user[1].inactive)
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
                                    //   checked={this.state.selectAll && true}
                                    onClick={handleCheckbox}
                                  />
                                )}
                              </td>
                              <td>
                                <MdDelete
                                  style={{
                                    fontSize: '22px',
                                    color: 'rgb(167, 0, 0)',
                                    cursor: 'pointer'
                                  }}
                                  onClick={() =>
                                    deleteOneUser(user[0], user[1].email)
                                  }
                                />
                              </td>
                              <td>{user[1].name}</td>
                              <td>{user[1].lastName}</td>
                              <td>{user[1].email}</td>
                              <td>{user[1].phone}</td>
                              <td>{user[1].country}</td>
                              <td>{user[1].teach_country}</td>
                              <td>{user[1].code}</td>
                              <td>{user[1].SKY.long === 1 ? 'On' : 'Off'}</td>
                              <td>{user[1].SKY.short === 1 ? 'On' : 'Off'}</td>
                              <td>{user[1].inactive ? 'Disable' : 'Enable'}</td>
                              <td>{user[1].TTCDate}</td>
                              <td>{user[1].sign === 1 ? 'Yes' : 'No'}</td>
                              <td>{user[1].comment}</td>
                              <td>{user[1].course?.HP}</td>
                              <td>{user[1].course?.SSY}</td>
                              <td>{user[1].course?.YesPlus}</td>
                              <td>{user[1].course?.Yes}</td>
                              <td>{user[1].course?.AE}</td>
                              <td>{user[1].course?.Sahaj}</td>
                              <td>{user[1].course?.Parte2}</td>
                              <td>{user[1].course?.Parte2SSY}</td>
                              <td>{user[1].course?.DSN}</td>
                              <td>{user[1].course?.VTP}</td>
                              <td>{user[1].course?.TTC}</td>
                            </tr>
                          ) : null
                        )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* PAGINATION */}
            {items.length > 0 && (
              <div className='containerBtnPage'>
                {pagination.page !== 0 ? (
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
                <p>{pagination.page + 1}</p>
                {pagination.page !== pagination.totalPages ? (
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
          </>
        ) : (
          <div className='not_permisions'>
            <p>
              No tiene permisos! Por favor{' '}
              <span
                className='not_permisions_link'
                onClick={() => history.push('/signin')}
              >
                inicie sesion de Administrador
              </span>
            </p>
          </div>
        )}

        <Footer />
      </div>
    </div>
  )
}
