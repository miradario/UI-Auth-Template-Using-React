// export const createAuthUser = async (email, password) => {
//     setIsLoading(true)

//     auth
//       .createUserWithEmailAndPassword(email, password) //CREA EL USUARIO DE LA AUTENTICACION
//       .then(authUser => {
//         //save the user id created into the state
//         const userNew = authUser.user.uid
//         console.log('userNew', userNew)

//         handleAddUser(userNew)
//       })
//       .catch(error => {
//         setIsLoading(false)
//         alert(error.message)
//       })
//   }
