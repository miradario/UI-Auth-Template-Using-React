import { db } from '../firebase/firebase.js'

const getDataUser = async key => {
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
    throw error
  }
}

export const updateKeyUser = async (keyRDB, keyUserAuth) => {
  try {
    // console.log(`KEY RDB: ${keyRDB} ||||| keyUserAuth: ${keyUserAuth}`)
    const data = await getDataUser(keyRDB)

    const newData = { ...data, authenticated: 1 }
    // console.log('NEW DATA: ', newData)

    //CREAR EL USUARIO PERO AHORA YA AUTENTICADO y con la clave que se genero cuando se autenticó!
    const userRef = db.ref('users/' + keyUserAuth)
    await userRef.set(newData)

    // console.log('ADD')

    //ELIMINAR EL USUARIO VIEJO (con auth = 0 y key vieja)
    const oldUserRef = db.ref('users/' + keyRDB)
    await oldUserRef.remove()

    // console.log('DELETE')
  } catch (e) {
    console.log('ERROR ' + e)
  }
}

export const deleteUser = async key => {
  try {
    const oldUserRef = db.ref('users/' + key)
    await oldUserRef.remove()
  } catch (e) {
    console.log(e)
  }
}
