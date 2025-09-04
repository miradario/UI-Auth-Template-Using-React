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
import { FaUserEdit, FaUserPlus } from 'react-icons/fa'
import { ImCross } from 'react-icons/im'
import styles from '../styles/users.module.css'
import { TABLE_HEADER } from '../constants/table.constants'
import { removeAccents } from '../helpers/strings.helpers'
import { Flex } from './commons/Flex'
import { COLORS } from '../constants/colors.constants'
import { ORDER_OPTIONS, PER_PAGE } from '../constants/filters.constants'

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
  const getPerPage = localStorage.getItem('perPage')
  const email = localStorage.getItem('email')

  //   const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  const [items, setItems] = useState([])
  const [itemsFilter, setItemsFilter] = useState([])
  const [showOrder, setShowOrder] = useState(false)
  const [pagination, setPagination] = useState({})
  const [perPage, setPerPage] = useState(
    getPerPage ? Number(getPerPage) : PER_PAGE[0]
  )
  const [showPagination, setShowPagination] = useState(false)
  const [selectedToAuthenticated, setSelectedToAuthenticated] = useState([])
  // const [selectAll, setSelectAll] = useState(false);
  const [valueSearchAux, setValueSearchAux] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const [loadingExcel, setLoadingExcel] = useState(false)
  const [loadingDeleteSelected, setLoadingDeleteSelected] = useState(false)
  const [loadingChangeActiveSelected, setLoadingChangeActiveSelected] =
    useState(false)

  const [filtersActive, setFiltersActive] = useState(initialFiltersActive)
  const [saveCheckboxes, setSaveCheckboxes] = useState([])

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

  useEffect(() => {
    localStorage.setItem('perPage', perPage)
  }, [perPage])

  const filterDataSearch = (array, value) => {
    const real_value = removeAccents(value)
    return array?.filter(
      el =>
        removeAccents(el[1].name)?.toLowerCase().includes(real_value) ||
        removeAccents(el[1].email)?.toLowerCase().includes(real_value) ||
        removeAccents(el[1].lastName)?.toLowerCase().includes(real_value) ||
        removeAccents(el[1].name + ' ' + el[1].lastName)
          ?.toLowerCase()
          .includes(real_value)
    )
  }

  const changeActiveUser = async (id, status, reload = true) => {
    await db.ref('users/' + id).update({
      inactive: status
    })

    console.log(
      'Change status inactive of: ',
      items.find(el => el[0] === id)[1].email,
      ' to ',
      status
    )

    if (reload) alert('User status changed')
    if (reload) window.location.reload(false)
  }

  const changeActiveSelectedUsers = async () => {
    if (loadingChangeActiveSelected || saveCheckboxes.length === 0) return

    const confirm = window.confirm(
      `¿Está seguro de que desea cambiar el estado de los usuarios seleccionados (${saveCheckboxes.length})?`
    )

    if (confirm) {
      setLoadingChangeActiveSelected(true)

      const promises = saveCheckboxes.map(key => {
        const findUser = items.find(el => el[0] === key)

        return findUser
          ? changeActiveUser(findUser[0], !findUser[1].inactive, false)
          : Promise.resolve()
      })

      try {
        await Promise.all(promises)
        window.location.reload()
      } catch (e) {
        console.error('Error changeActiveSelectedUsers:', e)
      } finally {
        setLoadingChangeActiveSelected(false)
      }
    }
  }

  useEffect(() => {
    setSaveCheckboxes([])
  }, [itemsFilter])

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
    if (saveCheckboxes.length === 10) {
      alert('You can only select up to 10 teachers at a time')
      return
    }

    const key = e.target.dataset.key

    if (saveCheckboxes.includes(key))
      setSaveCheckboxes(saveCheckboxes.filter(item => item !== key))
    else setSaveCheckboxes([...saveCheckboxes, key])
  }

  console.log('saveCheckboxes: ', saveCheckboxes)
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

  const deleteOneUser = async (key, email, reload = true) => {
    try {
      const confirm = reload
        ? window.confirm(
            '¿Seguro que desea eliminar el usuario: ' + email + '?'
          )
        : true

      if (confirm) {
        const oldUserRef = db.ref('users/' + key)
        await oldUserRef.remove()

        console.log('Usuario eliminado: ', email)

        if (reload) window.location.reload()
      } else {
        window.alert('ELIMINACION CANCELADA')
      }
    } catch (e) {
      console.error('Error deleteOneUser:', e)
    }
  }

  const deleteSelectedUsers = async () => {
    if (loadingDeleteSelected || saveCheckboxes.length === 0) return

    try {
      const confirm = window.confirm(
        `¿Está seguro de que desea eliminar a los usuarios seleccionados (${saveCheckboxes.length})?`
      )
      if (confirm) {
        setLoadingDeleteSelected(true)

        const promises = saveCheckboxes.map(key => {
          const findUser = items.find(el => el[0] === key)

          return findUser
            ? deleteOneUser(findUser[0], findUser[1].email, false)
            : Promise.resolve()
        })

        await Promise.all(promises)
        window.location.reload()
      }
    } catch (error) {
      console.error('Error in deleteSelectedUsers:', error)
    } finally {
      setLoadingDeleteSelected(false)
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
                {/* EXCEL BUTTON */}
                <div style={{ textAlign: 'right' }}>
                  <button
                    onClick={exportDataToExcel}
                    className={styles.exportExcelBtn}
                  >
                    {!loadingExcel ? 'EXPORT EXCEL' : 'Loading...'}
                  </button>
                </div>

                <div style={{ width: '90%', margin: '0 auto' }}>
                  {/* TITLE AND ADD USER */}
                  <Flex
                    align='center'
                    justify='center'
                    gap={20}
                    style={{ marginBottom: 10 }}
                  >
                    <h1 style={{ fontSize: 30, marginBottom: 0 }}>
                      Teachers ({itemsFilter.length})
                    </h1>
                    <FaUserPlus
                      onClick={() => history.push('/add-users')}
                      size={40}
                      className={styles.addIcon}
                    />
                  </Flex>

                  {/* SEARCH, FILTERS, ORDER, PAGINATION */}
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
                        padding: 8,
                        width: 350
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

                  <Flex justify='center' gap={20} style={{ marginBottom: 20 }}>
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
                            ? COLORS.red
                            : COLORS.grey
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
                          ? COLORS.primary
                          : COLORS.white,
                        color: existFilters(filtersActive.filters)
                          ? COLORS.white
                          : COLORS.black
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
                          ? COLORS.primary
                          : COLORS.white
                      }}
                      onClick={() => setShowOrder(!showOrder)}
                    >
                      <p
                        style={{
                          color: filtersActive.orderActive.active
                            ? COLORS.white
                            : COLORS.black
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
                              Eliminar Orden: {filtersActive.orderActive.value}
                            </li>
                          )}

                          {ORDER_OPTIONS.map(el => (
                            <li
                              data-id={el.key}
                              key={el.key}
                              onClick={orderDataByParam}
                            >
                              {el.label}
                            </li>
                          ))}
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
                          {PER_PAGE.map(el => (
                            <li key={el} onClick={() => setPerPage(el)}>
                              {el}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {existFilters(filtersActive.filters) && (
                      <Flex align='center'>
                        <ImCross
                          color={'red'}
                          style={{ cursor: 'pointer' }}
                          size={25}
                          onClick={() => setFiltersActive(initialFiltersActive)}
                        />
                      </Flex>
                    )}
                  </Flex>

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
                            color: COLORS.lightGray
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
                            color: COLORS.lightGray
                          }}
                        >
                          <BsChevronRight />
                        </div>
                      )}
                    </div>
                  )}
                  {/* PAGINATION CLOSE */}

                  {/* START TABLE WITH USERS DATA */}

                  {saveCheckboxes.length > 0 && (
                    <div className={styles.selectedUsersContainer}>
                      <h6> Selected Teachers: {saveCheckboxes.length}</h6>
                      {loadingChangeActiveSelected || loadingDeleteSelected ? (
                        <Loader size={40} />
                      ) : (
                        <Flex gap={10} justify='center'>
                          <button onClick={deleteSelectedUsers}>
                            Eliminar
                          </button>
                          <button onClick={changeActiveSelectedUsers}>
                            Activar / Desactivar
                          </button>
                          <button
                            onClick={() => {
                              const confirm = window.confirm(
                                '¿Desea cancelar la selección de usuarios?'
                              )
                              if (confirm) setSaveCheckboxes([])
                            }}
                          >
                            Cancelar
                          </button>
                        </Flex>
                      )}
                    </div>
                  )}
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
                          {TABLE_HEADER.map(el => (
                            <th key={el} scope='col'>
                              {el}
                            </th>
                          ))}
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
                              <td style={{ paddingLeft: 20 }}>
                                <FaUserEdit
                                  style={{ cursor: 'pointer' }}
                                  size={25}
                                  color={
                                    user[1].inactive
                                      ? COLORS.white
                                      : COLORS.primary
                                  }
                                  onClick={() => {
                                    history.push({
                                      pathname: '/add-users',
                                      state: { key: user[0] }
                                    })
                                  }}
                                />
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
                                    changeActiveUser(user[0], !user[1].inactive)
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
                                <input
                                  style={{ marginTop: 10 }}
                                  id='checked_option'
                                  type='checkbox'
                                  data-key={user[0]}
                                  checked={saveCheckboxes.includes(user[0])}
                                  onClick={handleCheckbox}
                                />
                              </td>
                              <td>
                                <MdDelete
                                  style={{
                                    marginTop: 5,
                                    fontSize: 22,
                                    color: COLORS.error,
                                    cursor: 'pointer'
                                  }}
                                  onClick={() =>
                                    deleteOneUser(user[0], user[1].email)
                                  }
                                />
                              </td>
                              <td>{formatDateDMA(user[1].updatedAt) || '-'}</td>
                              <td>{user[1].name}</td>
                              <td>{user[1].lastName}</td>
                              <td>{user[1].email}</td>
                              <td>{user[1].phone}</td>
                              <td>{user[1].country}</td>
                              <td>{user[1].teach_country}</td>
                              <td>{user[1].code}</td>
                              <td>{user[1]?.SKY?.long === 1 ? 'On' : 'Off'}</td>
                              <td>
                                {user[1]?.SKY?.short === 1 ? 'On' : 'Off'}
                              </td>
                              <td>{user[1].inactive ? 'Disable' : 'Enable'}</td>
                              <td>{user[1].TTCDate}</td>
                              <td>{user[1].placeTTC}</td>
                              <td>{user[1].sign === 1 ? 'Yes' : 'No'}</td>
                              <td>{user[1].comment}</td>
                              {/* CURSOS */}
                              <td>{user[1]?.course?.HP}</td>
                              <td>{user[1]?.course?.SSY}</td>
                              <td>{user[1]?.course?.SkyCampus}</td>
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
