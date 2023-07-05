import { db } from '../firebase/firebase.js'

export const getDataUser = async key => {
  try {
    // Obtén la referencia al nodo utilizando la clave
    const nodeRef = db.ref('users/' + key)

    // Obtén los datos del nodo una vez utilizando await
    const snapshot = await nodeRef.once('value')

    // Accede a los datos utilizando el método val()
    const data = snapshot.val()

    // Retorna los datos obtenidos
    return data
  } catch (error) {
    // Maneja cualquier error que pueda ocurrir
    console.error('Error al obtener los datos:', error)
    return null
  }
}

export const updateKeyUser = async (keyRDB, keyUserAuth) => {
  try {
    // console.log(`KEY RDB: ${keyRDB} ||||| keyUserAuth: ${keyUserAuth}`)
    const data = await getDataUser(keyRDB)

    const newData = { teach_country: '', ...data, authenticated: 1 }
    // console.log('NEW DATA: ', newData)

    //CREAR EL USUARIO PERO AHORA YA AUTENTICADO y con la clave que se genero cuando se autenticó!
    const userRef = db.ref('users/' + keyUserAuth)
    await userRef.set(newData)

    // console.log('ADD')

    //ELIMINAR EL USUARIO VIEJO (con auth = 0 y key vieja)
    const oldUserRef = db.ref('users/' + keyRDB)
    await oldUserRef.remove()

    return true
    // console.log('DELETE')
  } catch (e) {
    console.log('ERROR updateKeyUser' + e)
    return false
  }
}

export const deleteUser = async key => {
  try {
    const oldUserRef = db.ref('users/' + key)
    await oldUserRef.remove()
  } catch (e) {
    alert('ERROR AL ELIMINAR, AVISAR A SOPORTE, KEY: ' + key)
  }
}

export const editUserAuthenticate = async keyUser => {
  try {
    const data = await getDataUser(keyUser)

    const newData = { teach_country: '', ...data, authenticated: 1 }

    const userRef = db.ref('users/' + keyUser)
    await userRef.update(newData)

    return true
  } catch (e) {
    alert('Error en editUserAuthenticate, avisar a soporte! ' + e)
    return false
  }
}
