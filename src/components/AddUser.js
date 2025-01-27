// add user component

import React, { useEffect, useState } from 'react'
import { Button, Form, InputGroup, Container } from 'react-bootstrap'
import Navigation from './Navigation'
import { db } from '../firebase/firebase'
import { auth } from '../firebase/firebase'
import { getDataUser } from '../helpers/updateKeyUser'
import styles from '../styles/addUser.module.css'

const AddUserPage = props => {
  const [id, setId] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [teachCountry, setTeachCountry] = useState('')
  const [lastName, setLastname] = useState('')
  const [country, setCountry] = useState('')
  const [placeTTC, setPlaceTTC] = useState('')
  const [code, setCode] = useState('')
  const [long, setLong] = useState(false)
  const [short, setShort] = useState(false)
  const [ae, setAe] = useState(false)
  const [TTCDate, setTTCDate] = useState('')
  const [sign, setSign] = useState(false)
  const [mail, setMail] = useState(true)

  // course
  const [HP, setHP] = useState(false)
  const [AE, setAE] = useState(false)
  const [TTC, setTTC] = useState(false)
  const [DSN, setDSN] = useState(false)
  const [Parte2, setParte2] = useState(false)
  const [Parte2SSY, setParte2SSY] = useState(false)
  const [Prision, setPrision] = useState(false)
  const [SSY, setSSY] = useState(false)
  const [Sahaj, setSahaj] = useState(false)
  const [VTP, setVTP] = useState(false)
  const [YesPlus, setYesPlus] = useState(false)
  const [YES, setYES] = useState(false)
  const [PREMIUM, setPremium] = useState(false)
  const [RAS, setRAS] = useState(false)
  const [eternity, setEternity] = useState(false)
  const [intuition, setIntuition] = useState(false)
  const [scanning, setScanning] = useState(false)

  const [comment, setComment] = useState('')

  const [inactive, setInactive] = useState(false)
  const [error, setError] = useState(null)
  const [isloading, setIsLoading] = useState(false)

  //   console.log(props)

  // create async createAuthUser

  const createAuthUser = async (email, password, diferenteEmail = false) => {
    setIsLoading(true)

    const data = auth
      .createUserWithEmailAndPassword(email, password)
      .then(authUser => {
        //save the user id created into the state
        const userNew = authUser.user.uid
        // console.log('userNew', userNew)

        if (!diferenteEmail) {
          handleAddUser(userNew)
          return null
        } else {
          return userNew
        }
      })
      .catch(error => {
        setIsLoading(false)
        alert(error.message)
      })
    if (data) return data
  }

  //get the key from parameter and set the data in the fields with useEffect

  useEffect(() => {
    // console.log('props', props)
    const { key } = (props.location && props.location.state) || {}
    setId(key)
    //CHEKC IF THERE IS A PARMATER?

    console.log('id', key)
    if (key) {
      setIsLoading(true)
      db.ref('users/' + key)
        .once('value')
        .then(snapshot => {
          //   console.log('snapshot:', snapshot)
          if (snapshot) {
            setTeachCountry(snapshot.val()?.teach_country)
            setPhone(snapshot.val()?.phone)
            setName(snapshot.val()?.name)
            setEmail(snapshot.val()?.email)
            setCountry(snapshot.val()?.country)
            setComment(snapshot.val()?.comment)
            setPlaceTTC(snapshot.val()?.placeTTC)
            setInactive(snapshot.val()?.inactive || false)
            setCode(snapshot.val()?.code)
            setLastname(snapshot.val()?.lastName)
            setTTCDate(snapshot.val()?.TTCDate)
            const long = snapshot.val()?.SKY?.long === 1 ? true : false
            setLong(long)
            setSign(snapshot.val()?.sign === 1 ? true : false)
            setShort(snapshot.val()?.SKY?.short === 1 ? true : false)
            setAe(snapshot.val()?.SKY.ae === 1 ? true : false)
            setHP(snapshot.val()?.course?.HP === 'si' ? true : false)
            setAE(snapshot.val()?.course?.AE === 'si' ? true : false)
            setPremium(snapshot.val()?.course?.premium === 'si' ? true : false)
            setTTC(snapshot.val()?.course?.TTC === 'si' ? true : false)
            setDSN(snapshot.val()?.course?.DSN === 'si' ? true : false)
            setParte2(snapshot.val()?.course?.Parte2 === 'si' ? true : false)
            setParte2SSY(
              snapshot.val()?.course?.Parte2SSY === 'si' ? true : false
            )
            setPrision(snapshot.val()?.course?.Prision === 'si' ? true : false)
            setSSY(snapshot.val()?.course?.SSY === 'si' ? true : false)
            setSahaj(snapshot.val()?.course?.Sahaj === 'si' ? true : false)
            setVTP(snapshot.val()?.course?.VTP === 'si' ? true : false)
            setYesPlus(snapshot.val()?.course?.YesPlus === 'si' ? true : false)
            setYES(snapshot.val()?.course?.Yes === 'si' ? true : false)
            setRAS(snapshot.val()?.course?.RAS === 'si' ? true : false)
            setEternity(
              snapshot.val()?.course?.Eternity === 'si' ? true : false
            )
            setIntuition(
              snapshot.val()?.course?.Intuition === 'si' ? true : false
            )
            setScanning(
              snapshot.val()?.course?.Scanning === 'si' ? true : false
            )

            setIsLoading(false)
          }
        })
        .catch(e => {
          setIsLoading(false)
          alert(e.message)
        })
    }
  }, [props])

  const handleLong = long => {
    setLong(!long)
  }

  const handleShort = short => {
    setShort(!short)
  }

  const handleHP = hp => {
    setHP(!hp)
  }

  const handlePremium = premium => {
    setPremium(!premium)
  }

  const handleSign = sign => {
    setSign(!sign)
  }

  const handleAddUser = async userNew => {
    const long_1 = long ? 1 : 0
    const short_1 = short ? 1 : 0
    const ae_1 = ae ? 1 : 0
    const sign_1 = sign ? 1 : 0

    const hp_1 = HP ? 'si' : 'no'

    const ae_2 = AE ? 'si' : 'no'
    const ttc_1 = TTC ? 'si' : 'no'
    const dsn_1 = DSN ? 'si' : 'no'
    const parte2_1 = Parte2 ? 'si' : 'no'
    const parte2SSY_1 = Parte2SSY ? 'si' : 'no'
    const prision_1 = Prision ? 'si' : 'no'
    const ssy_1 = SSY ? 'si' : 'no'
    const sahaj_1 = Sahaj ? 'si' : 'no'
    const vtp_1 = VTP ? 'si' : 'no'
    const yesPlus_1 = YesPlus ? 'si' : 'no'
    const yes = YES ? 'si' : 'no'
    const premium_1 = PREMIUM ? 'si' : 'no'
    const ras = RAS ? 'si' : 'no'
    const etern = eternity ? 'si' : 'no'
    const intuit = intuition ? 'si' : 'no'
    const scann = scanning ? 'si' : 'no'

    const data = await getDataUser(userNew)
    let authent
    if (data) {
      if (data.authenticated === 0) {
        authent = 0
      } else {
        authent = 1
      }
    } else {
      authent = mail ? 1 : 0 // Esto deberia ser si el usuario es totalmente nuevo y no se lo quiere autenticar
    }

    // console.log(userNew, authent)

    // console.log('checks', long, short, ae)

    if (mail && !id) {
      auth.sendPasswordResetEmail(email)
    }

    const updateData = {
      name: name || '',
      email: email || '',
      phone: phone || '',
      country: country || '',
      code: code || '',
      inactive: inactive,
      teach_country: teachCountry || '',
      lastName: lastName || '',
      TTCDate: TTCDate || '',
      sign: sign_1,
      authenticated: authent,
      comment: comment || '',
      placeTTC: placeTTC || '',
      updatedAt: new Date().getTime(),
      SKY: {
        long: long_1 || 0,
        short: short_1 || 0,
        ae: ae_1 || 0
      },
      course: {
        HP: hp_1,
        AE: ae_2,
        TTC: ttc_1,
        DSN: dsn_1,
        Parte2: parte2_1,
        Parte2SSY: parte2SSY_1,
        Prision: prision_1,
        SSY: ssy_1,
        Sahaj: sahaj_1,
        VTP: vtp_1,
        YesPlus: yesPlus_1,
        Yes: yes,
        premium: premium_1,
        RAS: ras,
        Eternity: etern,
        Intuition: intuit,
        Scanning: scann
      }
    }
    console.log(userNew)
    // alert(JSON.stringify(updateData))
    console.log(data?.email, email, data)
    if (data?.email == email || !data) {
      db.ref('users/' + userNew)
        .update(updateData)
        .then(data => {
          //success callback
          if (id) {
            alert('User updated successfully')
          } else {
            // send email
            // if mail is checked send email
            alert('User added successfully')
          }
          setIsLoading(false)
          props.history.push({
            pathname: '/users'
          })
        })
        .catch(error => {
          //error callback
          alert('ERROR OCURRED!!')
          console.log(error)
          console.log('NOT EXISTS SOMEONE PROPERTY')
          console.log('error ', error)
          alert('ERROR: ', JSON.stringify(error))
        })
    } else {
      try {
        const newId = await createAuthUser(email, 'a1b2c3e4d5', true)
        console.log(newId)
        const user = db.ref('users/' + newId)
        await user.update(updateData)

        const oldUserRef = db.ref('users/' + userNew)
        await oldUserRef.remove()

        if (authent == 1) auth.sendPasswordResetEmail(email)

        if (id) {
          alert('User updated successfully')
        } else {
          // send email
          // if mail is checked send email
          alert('User added successfully')
        }
        setIsLoading(false)
        props.history.push({
          pathname: '/users'
        })

        if (authent == 1) await auth.sendPasswordResetEmail(email)
      } catch (error) {
        //error callback
        console.log(error)
        console.log('NOT EXISTS SOMEONE PROPERTY')
        console.log('error ', error)
        alert('ERROR OCURRED!')
      }
    }
  }

  const handleSubmit = async event => {
    event.preventDefault()
    // console.log('email', email)
    if (id) {
      handleAddUser(id)
    } else {
      if (mail) {
        await createAuthUser(email.trim(), password)
      } else {
        await createAuthUser(email.trim(), password)
        //handleAddUser(undefined) ---> FUNCION PARA QUE PUEDA CREAR UN USUARIO SIN TENER QUE AUTENTICARLO, FIJARSE QUE NOS DE PERMISOS PARA PONER ID RANDOM FIREBASE
      }
    }
  }
  // TODO: handle form submission

  return (
    <div
      className='div-flex'
      style={{ marginTop: '110px', marginBottom: '30px' }}
    >
      <Navigation />

      <Container>
        <center>
          <h1>{id ? 'Update Teacher' : 'Add Teacher'}</h1>
        </center>
        <br />
        {isloading ? ( // if loading show 'loading...'
          <div id='preloader'></div>
        ) : (
          <form onSubmit={handleSubmit} className='form_add_user'>
            <InputGroup className={styles.container_input}>
              <InputGroup.Prepend className='inputlabel'>
                Email* :
              </InputGroup.Prepend>
              <Form.Control
                id='inputtext'
                type='email'
                placeholder='user@gmail.com'
                value={email}
                required
                autoFocus
                onChange={event => setEmail(event.target.value)}
              />
            </InputGroup>

            {!id ? (
              <>
                <br />
                <InputGroup className={styles.container_input}>
                  <InputGroup.Prepend className='inputlabel'>
                    Password* :
                  </InputGroup.Prepend>
                  <Form.Control
                    id='inputtext'
                    type='password'
                    placeholder='********'
                    value={password}
                    autoFocus
                    required
                    onChange={event => setPassword(event.target.value)}
                  />
                </InputGroup>
              </>
            ) : null}
            <br />
            <InputGroup className={styles.container_input}>
              <InputGroup.Prepend className='inputlabel'>
                Name* :
              </InputGroup.Prepend>
              <Form.Control
                type='text'
                name='name'
                id='inputtextName'
                placeholder=' John '
                value={name}
                autoFocus
                required
                onChange={event => setName(event.target.value)}
              />
            </InputGroup>
            <br />
            <InputGroup className={styles.container_input}>
              <InputGroup.Prepend className='inputlabel'>
                Last Name* :
              </InputGroup.Prepend>
              <Form.Control
                type='text'
                name='lastName'
                id='inputtextLN'
                placeholder=' Doe'
                value={lastName}
                autoFocus
                required
                onChange={event => setLastname(event.target.value)}
              />
            </InputGroup>
            <br />
            <InputGroup className={styles.container_input}>
              <InputGroup.Prepend className='inputlabel'>
                Origin Country* :
              </InputGroup.Prepend>
              <Form.Control
                type='text'
                name='country'
                id='inputtextCountry'
                placeholder=' Argentina'
                value={country}
                autoFocus
                required
                onChange={event => setCountry(event.target.value)}
              />
            </InputGroup>
            <br />

            <InputGroup className={styles.container_input}>
              <InputGroup.Prepend className='inputlabel'>
                Phone:
              </InputGroup.Prepend>
              <Form.Control
                type='text'
                name='phone'
                id='inputtextPhone'
                placeholder=' +54 9 11 1234 5678'
                value={phone}
                autoFocus
                onChange={event => setPhone(event.target.value)}
              />
            </InputGroup>
            <br />
            <InputGroup className={styles.container_input}>
              <InputGroup.Prepend className='inputlabel'>
                Code:
              </InputGroup.Prepend>
              <Form.Control
                type='text'
                name='code'
                id='inputtextCode'
                placeholder='Insert Code'
                value={code}
                autoFocus
                onChange={event => setCode(event.target.value)}
              />
            </InputGroup>
            <br />
            <InputGroup className={styles.container_input}>
              <InputGroup.Prepend className='inputlabel'>
                Residence Country:
              </InputGroup.Prepend>
              <Form.Control
                type='text'
                name='teach_country'
                id='inputtextTeachCountry'
                value={teachCountry}
                placeholder='Argentina'
                autoFocus
                onChange={event => setTeachCountry(event.target.value)}
              />
            </InputGroup>
            <br />
            <InputGroup className={styles.container_input}>
              <InputGroup.Prepend className='inputlabel'>
                TTC Date:
              </InputGroup.Prepend>
              <Form.Control
                type='text'
                name='ttcdate'
                id='inputtextTTCDate'
                placeholder=' 2020-01-01'
                value={TTCDate}
                autoFocus
                onChange={event => setTTCDate(event.target.value)}
              />
            </InputGroup>
            <br />
            <InputGroup className={styles.container_input}>
              <InputGroup.Prepend className='inputlabel'>
                Place TTC:
              </InputGroup.Prepend>
              <Form.Control
                type='text'
                name='placeTTC'
                id='inputtextplaceTTC'
                placeholder='Argentina'
                value={placeTTC}
                autoFocus
                onChange={event => setPlaceTTC(event.target.value)}
              />
            </InputGroup>
            <br />
            <InputGroup className={styles.container_input}>
              <InputGroup.Prepend className='inputlabel'>
                Comment:
              </InputGroup.Prepend>
              <Form.Control
                type='text'
                name='comment'
                id='inputtextComment'
                placeholder=' Comment'
                value={comment}
                autoFocus
                onChange={event => setComment(event.target.value)}
              />
            </InputGroup>
            <br />

            {!id && (
              <Form.Check
                className='inputradio'
                label='Enviar mail de bienvenida'
                type='checkbox'
                name='mail'
                defaultChecked={mail}
                value={mail}
                onChange={() => setMail(!mail)}
              />
            )}
            {/* <br /> */}
            <Form.Check
              className='inputradio'
              label='Sign the contract'
              type='checkbox'
              name='Sing'
              id='Sing'
              defaultChecked={sign}
              value={sign}
              onChange={() => handleSign(sign)}
            />
            <br />
            <div style={{ display: 'flex' }}>
              <h3>Kriya Available</h3>
              <InputGroup style={{ width: '80%' }}>
                <Form.Check
                  className='inputradio'
                  label={'Long'}
                  type='checkbox'
                  name='Long'
                  defaultChecked={long}
                  value={long}
                  id='Long'
                  onChange={() => handleLong(long)}
                />
                <Form.Check
                  className='inputradio'
                  label='Short'
                  type='checkbox'
                  name='Short'
                  id='Short'
                  defaultChecked={short}
                  value={short}
                  onChange={() => handleShort(short)}
                />
              </InputGroup>
            </div>
            <br />
            {/* COURSES */}
            <h5>Courses</h5>
            <InputGroup className={styles.courses_container}>
              <div>
                <label htmlFor='HP'>Parte 1</label>
                <Form.Check
                  type='checkbox'
                  name='HP'
                  defaultChecked={HP}
                  value={HP}
                  id='HP'
                  onChange={() => handleHP(HP)}
                />
              </div>
              <div>
                <label htmlFor='PREMIUM'>Premium</label>
                <Form.Check
                  type='checkbox'
                  name='PREMIUM'
                  defaultChecked={PREMIUM}
                  value={PREMIUM}
                  id='PREMIUM'
                  onChange={() => handlePremium(PREMIUM)}
                />
              </div>
              <div>
                <label htmlFor='SSY'>SSY</label>
                <Form.Check
                  id='SSY'
                  type='checkbox'
                  name='SSY'
                  defaultChecked={SSY}
                  value={SSY}
                  onChange={() => setSSY(!SSY)}
                />
              </div>
              <div>
                <label htmlFor='YesPlus'>Yes Plus</label>
                <Form.Check
                  id='YesPlus'
                  type='checkbox'
                  name='YesPlus'
                  defaultChecked={YesPlus}
                  value={YesPlus}
                  onChange={() => setYesPlus(!YesPlus)}
                />
              </div>
              <div>
                <label htmlFor='YES'>YES</label>
                <Form.Check
                  id='YES'
                  type='checkbox'
                  name='YES'
                  defaultChecked={YES}
                  value={YES}
                  onChange={() => setYES(!YES)}
                />
              </div>
              <div>
                <label htmlFor='AE'>AE</label>
                <Form.Check
                  id='AE'
                  type='checkbox'
                  name='AE'
                  defaultChecked={AE}
                  value={AE}
                  onChange={() => setAE(!AE)}
                />
              </div>
              <div>
                <label htmlFor='Sahaj'>Sahaj</label>
                <Form.Check
                  id='Sahaj'
                  type='checkbox'
                  name='Sahaj'
                  defaultChecked={Sahaj}
                  value={Sahaj}
                  onChange={() => setSahaj(!Sahaj)}
                />
              </div>
              <div>
                <label htmlFor='Parte_2'>Parte 2</label>
                <Form.Check
                  id='Parte_2'
                  type='checkbox'
                  name='Parte2'
                  defaultChecked={Parte2}
                  value={Parte2}
                  onChange={() => setParte2(!Parte2)}
                />
              </div>
              <div>
                <label htmlFor='Parte2_SSY'>Parte2 SSY</label>
                <Form.Check
                  id='Parte2_SSY'
                  type='checkbox'
                  name='Parte2SSY'
                  defaultChecked={Parte2SSY}
                  value={Parte2SSY}
                  onChange={() => setParte2SSY(!Parte2SSY)}
                />
              </div>
              <div>
                <label htmlFor='Prision'>Prision</label>
                <Form.Check
                  id='Prision'
                  type='checkbox'
                  name='Prision'
                  defaultChecked={Prision}
                  value={Prision}
                  onChange={() => setPrision(!Prision)}
                />
              </div>
              <div>
                <label htmlFor='DSN'>DSN</label>
                <Form.Check
                  id='DSN'
                  type='checkbox'
                  name='DSN'
                  defaultChecked={DSN}
                  value={DSN}
                  onChange={() => setDSN(!DSN)}
                />
              </div>
              <div>
                <label htmlFor='VTP'>VTP</label>
                <Form.Check
                  id='VTP'
                  type='checkbox'
                  name='VTP'
                  defaultChecked={VTP}
                  value={VTP}
                  onChange={() => setVTP(!VTP)}
                />
              </div>
              <div>
                <label htmlFor='TTC'>TTC</label>
                <Form.Check
                  id='TTC'
                  type='checkbox'
                  name='TTC'
                  defaultChecked={TTC}
                  value={TTC}
                  onChange={() => setTTC(!TTC)}
                />
              </div>
              <div>
                <label htmlFor='RAS'>RAS</label>
                <Form.Check
                  id='RAS'
                  type='checkbox'
                  name='RAS'
                  defaultChecked={RAS}
                  value={RAS}
                  onChange={() => setRAS(!RAS)}
                />
              </div>
              <div>
                <label htmlFor='eternity'>Eternity</label>
                <Form.Check
                  id='eternity'
                  type='checkbox'
                  name='eternity'
                  defaultChecked={eternity}
                  value={eternity}
                  onChange={() => setEternity(!eternity)}
                />
              </div>
              <div>
                <label htmlFor='intuition'>Intuition</label>
                <Form.Check
                  id='intuition'
                  type='checkbox'
                  name='intuition'
                  defaultChecked={intuition}
                  value={intuition}
                  onChange={() => setIntuition(!intuition)}
                />
              </div>
              <div>
                <label htmlFor='scanning'>Scanning</label>
                <Form.Check
                  id='scanning'
                  type='checkbox'
                  name='scanning'
                  defaultChecked={scanning}
                  value={scanning}
                  onChange={() => setScanning(!scanning)}
                />
              </div>
            </InputGroup>
            <br />
            <div className='text-center'>
              <Button type='submit' id='mybutton'>
                {id ? 'Update Teacher' : 'Add Teacher'}
              </Button>
            </div>
          </form>
        )}
      </Container>
    </div>
  )
}

export default AddUserPage
