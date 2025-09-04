import { auth, db } from '../firebase/firebase'
import { UserType } from '../types/user.types'

export class UserRepository {
  static async getAll (): Promise<{
    ok: boolean
    data?: UserType[]
    error?: string
  }> {
    try {
      const snapshot = await db.ref('users/').once('value')

      const mapData = Object.entries(snapshot.val()).map((el: any) => ({
        ...el[1],
        userKey: el[0]
      }))

      return { ok: true, data: mapData }
    } catch (e: any) {
      console.error('Error getAllUsers:', e)
      return { ok: false, error: e?.message || 'Error fetching users' }
    }
  }

  static getOne = async (id: string) => {
    try {
      // Obtén la referencia al nodo utilizando la clave
      const nodeRef = db.ref('users/' + id)

      // Obtén los datos del nodo una vez utilizando await
      const snapshot = await nodeRef.once('value')

      // Accede a los datos utilizando el método val()
      const data = snapshot.val()

      // Retorna los datos obtenidos
      return { ok: true, data }
    } catch (error: any) {
      // Maneja cualquier error que pueda ocurrir
      console.error('Error al obtener los datos del nodo:', error)
      return {
        ok: false,
        error: error?.message || 'Error al obtener los datos del nodo'
      }
    }
  }

  static deleteOne = async (key: string, email: string) => {
    try {
      const oldUserRef = db.ref('users/' + key)

      await oldUserRef.remove()

      return { ok: true }
    } catch (e: any) {
      console.error('Error deleteOneUser:', e)
      return { ok: false, error: e?.message || 'Error deleting user' }
    }
  }

  static deleteSelected = async (users: UserType[]) => {
    try {
      const promises = users.map(user =>
        this.deleteOne(user.userKey, user.email)
      )

      await Promise.all(promises)

      return { ok: true }
    } catch (error) {
      console.error('Error in deleteSelectedUsers:', error)
      return { ok: false, error: 'Error deleting selected users' }
    }
  }

  static changeActiveStatus = async (id: string, status: boolean) => {
    try {
      await db.ref('users/' + id).update({
        inactive: status
      })

      return { ok: true }
    } catch (e: any) {
      console.error('Error changeActiveStatus:', e)
      return { ok: false, error: e?.message || 'Error changing active status' }
    }
  }

  static authenticate = async (user: UserType) => {
    try {
      const keyUserAuth = await this.createAuthUser(user.email.trim())

      const res = await (keyUserAuth
        ? this.updateKey(user.userKey, keyUserAuth)
        : this.editAuthenticate(user.userKey))

      if (!res.ok)
        throw new Error(res.error || 'No se pudo actualizar el usuario')

      await auth.sendPasswordResetEmail(user.email.trim())

      return { ok: true }
    } catch (error: any) {
      console.error('Error en handleAuthenticateUser:', error)
      return {
        ok: false,
        error:
          error?.message ||
          'Error en handleAuthenticateUser para usuario: ' + error
      }
    }
  }

  static updateKey = async (
    keyRDB: string,
    keyUserAuth: string
  ): Promise<{ ok: boolean; error?: string }> => {
    try {
      // console.log(`KEY RDB: ${keyRDB} ||||| keyUserAuth: ${keyUserAuth}`)
      const resGetOne = await this.getOne(keyRDB)

      if (!resGetOne.ok) throw new Error('No se pudo obtener el usuario')

      const data = resGetOne.data

      const newData = { teach_country: '', ...data, authenticated: 1 }
      // console.log('NEW DATA: ', newData)

      //CREAR EL USUARIO PERO AHORA YA AUTENTICADO y con la clave que se genero cuando se autenticó!
      const userRef = db.ref('users/' + keyUserAuth)
      await userRef.set(newData)

      // console.log('ADD')

      //ELIMINAR EL USUARIO VIEJO (con auth = 0 y key vieja)
      const oldUserRef = db.ref('users/' + keyRDB)
      await oldUserRef.remove()

      return { ok: true }
      // console.log('DELETE')
    } catch (e: any) {
      console.error('ERROR updateKeyUser: ', e)
      return { ok: false, error: e?.message || 'Error en updateKeyUser' }
    }
  }

  private static createAuthUser = async (email: string) => {
    const userNew = await auth
      .createUserWithEmailAndPassword(email, 'a1b2c3d4e5') //CREA EL USUARIO DE LA AUTENTICACION
      .then(authUser => {
        if (!authUser?.user) return null
        const userNew = authUser.user.uid

        return userNew
      })
      .catch(error => {
        console.error('Error createAuthUser: ', error)
        return null
      })
    return userNew
  }

  private static editAuthenticate = async (
    keyUser: string
  ): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await this.getOne(keyUser)

      if (!res.ok) throw new Error('No se pudo obtener el usuario')

      const data = res.data

      const newData = { teach_country: '', ...data, authenticated: 1 }

      const userRef = db.ref('users/' + keyUser)
      await userRef.update(newData)

      return { ok: true }
    } catch (e: any) {
      console.error('ERROR editUserAuthenticate: ', e)
      return { ok: false, error: e?.message || 'Error en editUserAuthenticate' }
    }
  }
}
