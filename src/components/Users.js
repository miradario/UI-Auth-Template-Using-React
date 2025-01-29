import React, { useState, useEffect } from 'react'
import Navigation from './Navigation'
import * as XLSX from 'xlsx'
import { db, auth } from '../firebase/firebase'
import Footer from './Footer'
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs'
import { MdDelete } from 'react-icons/md'
import {
  //   deleteUser,
  editUserAuthenticate,
  updateKeyUser
} from '../helpers/updateKeyUser'

import { AiOutlineSearch } from 'react-icons/ai'
import { ModalFilters } from './Filters/ModalFilters'
import { filterUsers } from '../helpers/filterUsers'
import { Loader } from './commons/Loader'
import { useHistory } from 'react-router-dom/cjs/react-router-dom'
import { formatDateDMA } from '../helpers/formatDateDMA'

const initialFiltersActive = {
  searchValue: '',
  orderActive: {
    by: '',
    value: ''
  },
  filters: {
    name: null,
    lastName: null,
    email: null,
    country: [],
    state: null,
    TTCDate: [],
    courses: [],
    phone: null,
    teach_country: []
  },
  showInactive: 'false'
}

const existFilters = filters => {
  const entries = Object.entries(filters)
  const exist = entries.some(el => {
    return typeof el[1] === 'boolean' || el[1]?.length > 0
  })
  return exist
}

export default function Users () {
  const history = useHistory()
  //   const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const email = localStorage.getItem('email')

  const [items, setItems] = useState([])
  const [itemsFilter, setItemsFilter] = useState([])
  const [showOrder, setShowOrder] = useState(false)
  const [pagination, setPagination] = useState({})
  const [perPage, setPerPage] = useState(25)
  const [showPagination, setShowPagination] = useState(false)
  const [selectedToAuthenticated, setSelectedToAuthenticated] = useState([])
  // const [selectAll, setSelectAll] = useState(false);
  const [valueSearchAux, setValueSearchAux] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const [loadingExcel, setLoadingExcel] = useState(false)

  const [filtersActive, setFiltersActive] = useState(initialFiltersActive)

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
      if (filtersActive.searchValue)
        array = filterDataSearch([...array], filtersActive.searchValue)

      if (filtersActive.orderActive.active)
        array = orderArray([...array], filtersActive.orderActive.value)

      array = filterUsers([...array], filtersActive.filters)

      const showInactive = filtersActive.showInactive === 'true'

      array = [...array].filter(el => {
        if (!showInactive) return !!el[1].inactive === false
        return true
      })

      localStorage.setItem('filtersActive', JSON.stringify(filtersActive))

      setItemsFilter(array)
    }
  }, [filtersActive])

  const quitarTildes = cadena => {
    return cadena?.normalize('NFD')?.replace(/[\u0300-\u036f]/g, '')
  }

  const filterDataSearch = (array, value) => {
    const real_value = quitarTildes(value)
    return array?.filter(
      el =>
        quitarTildes(el[1].name)?.toLowerCase().includes(real_value) ||
        quitarTildes(el[1].email)?.toLowerCase().includes(real_value) ||
        quitarTildes(el[1].lastName)?.toLowerCase().includes(real_value) ||
        quitarTildes(el[1].name + ' ' + el[1].lastName)
          ?.toLowerCase()
          .includes(real_value)
    )
  }

  const deleteAuthUser = (id, status) => {
    db.ref('users/' + id).update({
      inactive: status
    })
    alert('User status changed')
    window.location.reload(false)
  }

  // const getData = () => {
  //   db.ref("users/").on("value", (snapshot) => {
  //     let items = snapshot.val();
  //     let newState = [];
  //     for (let item in items) {
  //       newState.push({
  //         id: item,
  //         name: items[item].name,
  //         lastName: items[item].lastName,
  //         email: items[item].email,
  //         phone: items[item].phone,
  //         country: items[item].country,
  //         code: items[item].code,
  //         TTCDate: items[item].TTCDate,
  //         sign: items[item].sign,
  //         address: items[item].address,
  //         inactive: items[item].inactive,
  //       });
  //     }
  //     setItems(newState);
  //   });
  // };

  useEffect(() => {
    const filters = JSON.parse(localStorage.getItem('filtersActive'))
    setIsLoaded(true)
    db.ref('users/')
      .once('value')
      .then(snapshot => {
        if (snapshot) {
          const entries = Object.entries(snapshot.val())

          setItems(entries)
          setItemsFilter(entries)
          setPagination({
            page: 0,
            perPage: perPage,
            totalPages:
              Math.floor(entries.length / perPage) != entries.length / perPage
                ? Math.floor(entries.length / perPage)
                : entries.length / perPage - 1
          })
        }
      })
      .catch(e => {
        console.error('Error get users: ', e)
      })
      .finally(() => {
        const realFilters = parseJson(filters?.filters)
        setFiltersActive(
          filters ? { ...filters, filters: realFilters } : initialFiltersActive
        )
        setValueSearchAux(
          filters?.searchValue || initialFiltersActive.searchValue
        )
        setIsLoaded(false)
      })
  }, [])

  const parseJson = data => {
    if (!data) return null

    const entries = Object.entries(data)
    const obj = {}

    entries.forEach(el => {
      obj[el[0]] = el[1] === 'true' ? true : el[1] === 'false' ? false : el[1]
    })

    return obj
  }

  const orderArray = (array, param) => {
    const filterArray =
      param === 'updatedAt' ? array.filter(el => !!el[1].updatedAt) : array
    const notUpdated = array.filter(el => !el[1].updatedAt)

    let min, aux
    // console.log(param, array.length)
    for (let i = 0; i < filterArray.length - 1; i++) {
      min = i
      for (let j = i + 1; j < filterArray.length; j++) {
        if (param === 'email') {
          if (
            filterArray[j][1][param]?.toLowerCase() <
            filterArray[min][1][param]?.toLowerCase()
          )
            min = j
        } else {
          if (param === 'updatedAt') {
            if (
              filterArray[j][1][param] ||
              0 <= filterArray[min][1][param] ||
              0
            )
              min = j
          } else {
            if (
              filterArray[j][1][param]?.toLowerCase().trim() <
              filterArray[min][1][param]?.toLowerCase().trim()
            )
              min = j
          }
        }
      }

      if (min !== i) {
        aux = filterArray[i]
        filterArray[i] = filterArray[min]
        filterArray[min] = aux
      }
    }

    return param === 'updatedAt' ? [...filterArray, ...notUpdated] : filterArray
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

  //   console.log(itemsFilter?.filter(el => !el[1]?.course))

  const createAuthUser = async email => {
    setIsLoaded(true)
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
        console.log('error: 251', error)
        console.log(error.message)
        return null
      })
    return userNew
  }

  const handleAuthenticateUser = async (user, actualizar = true) => {
    try {
      const keyUserAuth = await createAuthUser(user[1]?.email.trim())
      let res
      if (keyUserAuth) {
        res = await updateKeyUser(user[0], keyUserAuth)
        if (!res)
          throw new Error('Error en updateKeyUser, usuario: ' + user[1].email)
      } else {
        res = await editUserAuthenticate(user[0])
        if (!res)
          throw new Error(
            'Error en editUserAuthenticate, usuario: ' + user[1].email
          )
      }

      if (res) auth.sendPasswordResetEmail(user[1].email?.trim())
      if (actualizar && res) window.location.reload()
    } catch (error) {
      console.log(error)
      alert('Error en handleAuthenticateUser para usuario: ' + error)
      //   throw error
    }
  }

  async function sendSelected (funcion, n) {
    if (n > 0) {
      try {
        await funcion(selectedToAuthenticated[n - 1], false)
      } catch (error) {
        // Manejar el error de la función aquí si es necesario
        console.error('Error en la función asíncrona:', error)
        throw error // Propagar el error para detener la recursión
      }
      await sendSelected(funcion, n - 1)
    } else {
      alert(
        'Todo salio bien :), por favor avisele a soporte que usuarios autentico si es posible, para verificar'
      )
      window.location.reload()
    }
  }
  //MARCAR INPUTS CHECKBOX
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
  //   const sendSelected = () => {
  //     const promises = selectedToAuthenticated.map(
  //       async el => await handleAuthenticateUser(el, false)
  //     )

  //     Promise.all(promises)
  //       .then(() => {
  //         window.location.reload()
  //       })
  //       .catch(error => {
  //         console.log(error)
  //       })
  //   }

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

  //   useEffect(() => {
  //     allChecks()
  //   }, [selectAll])

  // const allChecks = () => {
  //   const checks = document.querySelectorAll("#checked_option");
  //   if (selectAll) checks.forEach((el) => el.setAttribute("checked", true));
  //   else checks.forEach((el) => el.removeAttribute("checked"));
  //   // console.log(checks)
  // };

  // const selectAllNotAuths = () => {
  //   const notAuth = !selectAll
  //     ? itemsFilter.filter((el) => el[1].authenticated === 0 && !el[1].inactive)
  //     : [];
  //   setSelectedToAuthenticated(notAuth);
  //   setSelectAll(!selectAll);
  // };

  //   console.log(selectedToAuthenticated.length)

  /** ==================== BUSCADOR =======================*/

  const handleSearch = e => {
    e.preventDefault()
    const value = valueSearchAux.toLowerCase().trim()
    setFiltersActive({ ...filtersActive, searchValue: value })
  }

  const handleSearchChange = e => {
    const value = e.target.value.toLowerCase().trim()
    setFiltersActive({ ...filtersActive, searchValue: value })
  }

  // const coursesConcatenate = (courses) => {
  //   let coursesString = "";
  //   courses.forEach((el, i) => {
  //     if (i == courses.length - 1) {
  //       alert(el);
  //       // if content = 'si' then add key to string
  //       if (el === "si") coursesString += "key: " + i + ", ";
  //     } else {
  //       coursesString += el + ", ";
  //     }
  //   });
  //   return coursesString;
  // };

  const exportDataToExcel = () => {
    setLoadingExcel(true)
    const dataWithoutId = itemsFilter.map(el => {
      const newArray = {
        id: el[0],
        authenticated: 1,
        ...el[1],
        ...el[1].SKY,
        ...el[1].course
      }
      delete newArray.SKY
      delete newArray.course
      return newArray
    })

    const libro = XLSX.utils.book_new()
    const hoja = XLSX.utils.json_to_sheet(dataWithoutId)
    XLSX.utils.book_append_sheet(libro, hoja, 'Users')

    setTimeout(() => {
      XLSX.writeFile(libro, 'Users_TeachersAOL.xlsx')
      setLoadingExcel(false)
    }, 1500)
  }

  return (
    <div className='App'>
      <div>
        <Navigation />
        <br />
        <br />
        <br />
        <br />

        {!isLoaded ? (
          email === 'sistemas@elartedevivir.org' ? (
            <>
              <div style={{ width: '100%' }}>
                <div style={{ textAlign: 'right' }}>
                  <button
                    onClick={exportDataToExcel}
                    style={{
                      backgroundColor: '#d39e00',
                      color: 'white',
                      borderRadius: '5px',
                      border: 'none',
                      outline: '2px solid black',
                      marginTop: '15px',
                      marginRight: '15px',
                      padding: '5px 15px'
                    }}
                  >
                    {!loadingExcel ? 'EXPORT TO EXCEL' : 'Loading...'}
                  </button>
                </div>
                <div style={{ width: '90%', margin: '0 auto' }}>
                  <div style={{ width: '100%' }}>
                    <h1 style={{ marginBottom: '20px' }}>
                      Teachers ({itemsFilter.length})
                    </h1>
                    <form
                      className='formSearch'
                      onSubmit={e => e.preventDefault()}
                    >
                      {/* onSubmit={handleSearch} */}
                      <input
                        type='text'
                        placeholder='Nombre, apellido o email...'
                        style={{
                          display: 'block',
                          padding: '8px',
                          width: '350px'
                        }}
                        name='search'
                        // value={valueSearchAux}
                        // onChange={e => setValueSearchAux(e.target.value)}
                        value={filtersActive.searchValue}
                        onChange={handleSearchChange}
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
                        onClick={() =>
                          setFiltersActive({
                            ...filtersActive,
                            showInactive: (!(
                              filtersActive.showInactive === 'true'
                            )).toString()
                          })
                        }
                        style={{
                          backgroundColor:
                            filtersActive.showInactive === 'true'
                              ? 'red'
                              : 'grey'
                        }}
                      >
                        {filtersActive.showInactive === 'false'
                          ? 'Show inactive users'
                          : 'Hide inactive users'}
                      </button>

                      <div
                        className='orderContainer'
                        onClick={() => setShowFilters(true)}
                        style={{
                          backgroundColor: existFilters(filtersActive.filters)
                            ? '#feae00'
                            : 'white',
                          color: existFilters(filtersActive.filters)
                            ? 'white'
                            : 'black'
                        }}
                      >
                        <p>
                          Filtro:{' '}
                          {existFilters(filtersActive.filters)
                            ? `Activo`
                            : 'Inactivo'}
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
                        <p
                          style={{
                            color: filtersActive.orderActive.active
                              ? 'white'
                              : 'black'
                          }}
                        >
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
                                Eliminar Orden:{' '}
                                {filtersActive.orderActive.value}
                              </li>
                            )}
                            <li data-id='updatedAt' onClick={orderDataByParam}>
                              Last Update
                            </li>
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

                    <button
                      onClick={() =>
                        existFilters(filtersActive.filters)
                          ? setFiltersActive(initialFiltersActive)
                          : null
                      }
                      style={{
                        cursor: 'pointer',
                        padding: '5px 20px',
                        backgroundColor: existFilters(filtersActive.filters)
                          ? '#feae00'
                          : 'grey',
                        fontWeight: 'bold',
                        color: existFilters(filtersActive.filters)
                          ? 'white'
                          : 'black'
                      }}
                    >
                      Clear Filters
                    </button>

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
                        <p>
                          {pagination.page + 1} / {pagination.totalPages + 1}
                        </p>
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

                    <div style={{ overflow: 'auto' }}>
                      <table
                        className='table table-striped'
                        style={{
                          fontSize: 12,
                          width: '100%',
                          overflow: 'auto'
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
                            <th scope='col'>Last Update</th>
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
                            <th scope='col'>TTC Place</th>
                            <th scope='col'>Sign Contract</th>
                            <th scope='col'>Comment</th>
                            <th scope='col'>P1</th>
                            <th scope='col'>SSY</th>
                            <th scope='col'>Yes+</th>
                            <th scope='col'>Yes</th>
                            <th scope='col'>AE</th>
                            <th scope='col'>Sahaj</th>
                            <th scope='col'>P2</th>
                            <th scope='col'>SSY2</th>
                            <th scope='col'>Prision</th>
                            <th scope='col'>DSN</th>
                            <th scope='col'>VTP</th>
                            <th scope='col'>TTC</th>
                            <th scope='col'>Premium</th>
                            <th scope='col'>RAS</th>
                            <th scope='col'>Eternity</th>
                            <th scope='col'>Intuition</th>
                            <th scope='col'>Scanning</th>
                            <th scope='col'>Angels</th>
                            <th scope='col'>Ansiedad y sueño profundo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {itemsFilter
                            .slice(
                              pagination.page * pagination.perPage,
                              (pagination.page + 1) * pagination.perPage
                            )
                            .map(user => (
                              <tr
                                id='list_users'
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
                                      onClick={() =>
                                        handleAuthenticateUser(user)
                                      }
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
                                      id='checked_option'
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
                                <td>
                                  {formatDateDMA(user[1].updatedAt) || '-'}
                                </td>
                                <td>{user[1].name}</td>
                                <td>{user[1].lastName}</td>
                                <td>{user[1].email}</td>
                                <td>{user[1].phone}</td>
                                <td>{user[1].country}</td>
                                <td>{user[1].teach_country}</td>
                                <td>{user[1].code}</td>
                                <td>
                                  {user[1]?.SKY?.long === 1 ? 'On' : 'Off'}
                                </td>
                                <td>
                                  {user[1]?.SKY?.short === 1 ? 'On' : 'Off'}
                                </td>
                                <td>
                                  {user[1].inactive ? 'Disable' : 'Enable'}
                                </td>
                                <td>{user[1].TTCDate}</td>
                                <td>{user[1].placeTTC}</td>
                                <td>{user[1].sign === 1 ? 'Yes' : 'No'}</td>
                                <td>{user[1].comment}</td>
                                {/* CURSOS */}
                                <td>{user[1]?.course?.HP}</td>
                                <td>{user[1]?.course?.SSY}</td>
                                <td>{user[1]?.course?.YesPlus}</td>
                                <td>{user[1]?.course?.Yes}</td>
                                <td>{user[1]?.course?.AE}</td>
                                <td>{user[1]?.course?.Sahaj}</td>
                                <td>{user[1]?.course?.Parte2}</td>
                                <td>{user[1]?.course?.Parte2SSY}</td>
                                <td>{user[1]?.course?.Prision}</td>
                                <td>{user[1]?.course?.DSN}</td>
                                <td>{user[1]?.course?.VTP}</td>
                                <td>{user[1]?.course?.TTC}</td>
                                <td>{user[1]?.course?.premium}</td>
                                <td>{user[1]?.course?.RAS}</td>
                                <td>{user[1]?.course?.Eternity}</td>
                                <td>{user[1]?.course?.Intuition}</td>
                                <td>{user[1]?.course?.Scanning}</td>
                                <td>{user[1]?.course?.Angels}</td>
                                <td>{user[1]?.course?.AnxDeepSleep}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
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
                  <p>
                    {pagination.page + 1} / {pagination.totalPages + 1}
                  </p>
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
          )
        ) : (
          <div className='not_permisions '>
            <div className='loader_container'>
              <Loader newClass='loader-order' />
              <p>Loading Users</p>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  )
}
