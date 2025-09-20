// add user component

import React, { FormEvent, useEffect, useState } from "react";
import { Button, Form, InputGroup, Container } from "react-bootstrap";
import Navigation from "./Navigation";
import { auth } from "../firebase/firebase";
import styles from "../styles/addUser.module.css";
import { UserRepository } from "../repositories/user.rps";
import { UserDataAddType, UserType } from "../types/user.types";
import { Constants } from "../constants/constants";
import { Flex } from "./commons/Flex";
import { Loader } from "./commons/Loader";

const AddUserPage = (props: {
  location: { state: { key: string } } | undefined;
  history: {
    push: (arg0: { pathname: string }) => void;
  };
}) => {
  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState("");
  const [mail, setMail] = useState(true);
  const [userData, setUserData] = useState<UserDataAddType>(
    Constants.INITIAL_DATA_ADD_USER
  );
  const [isloading, setIsLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const createAuthUser = async (
    email: string,
    password: string,
    diferenteEmail = false
  ) => {
    setLoadingSubmit(true);

    const data = auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        if (!authUser?.user) throw new Error("No user created");
        //save the user id created into the state
        const userNew = authUser.user.uid;
        // console.log('userNew', userNew)

        if (!diferenteEmail) {
          handleAddUser(userNew);
          return null;
        } else {
          return userNew;
        }
      })
      .catch((error) => {
        setLoadingSubmit(false);
        alert(error.message);
      });
    if (data) return data;
  };

  const initEffect = async () => {
    const { key } = (props.location && props.location.state) || { key: "" };
    if (key) {
      setIsLoading(true);
      setId(key);
      const res = await UserRepository.getOne(key);

      if (res.ok && res.data) {
        const { course, ...rest } = res.data;

        const entriesCourse = Object.entries(course || {});
        const objectCourse: any = {};

        entriesCourse.forEach(([k, v]) => {
          objectCourse[k] = v?.toLowerCase() === "si" ? true : false;
        });

        setUserData({
          ...rest,
          course: { ...Constants.INITIAL_COURSES_ADD_USER, ...objectCourse },
        });
      } else alert(res.error || "Error getting user data");

      setIsLoading(false);
    }
  };

  useEffect(() => {
    initEffect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  const handleAddUser = async (userNew: string) => {
    const res = await UserRepository.getOne(userNew);

    const data = res.data;

    const authent = data ? (data.authenticated === 0 ? 0 : 1) : mail ? 1 : 0; // Esto deberia ser si el usuario es totalmente nuevo y no se lo quiere autenticar

    // console.log(userNew, authent)

    // console.log('checks', long, short, ae)

    if (mail && !id) auth.sendPasswordResetEmail(userData.email.trim());

    const courseEntries = Object.entries(userData.course || {});
    const courseObject: any = {};

    courseEntries.forEach(([k, v]) => {
      courseObject[k] = v ? "si" : "no";
    });

    const updateData: Omit<UserType, "userKey"> = {
      ...userData,
      course: courseObject,
      authenticated: authent,
      updatedAt: new Date().getTime(),
    };

    // alert(JSON.stringify(updateData))
    if (data?.email === userData.email || !data) {
      const response = await UserRepository.updateOne(userNew, updateData);

      if (response.ok) {
        alert(id ? "User updated successfully" : "User added successfully");
        props.history.push({
          pathname: "/users",
        });
      } else alert("Error: " + response.error);
    } else {
      const newId = await createAuthUser(userData.email, "a1b2c3e4d5", true);

      if (newId) {
        const response = await UserRepository.updateOne(newId, updateData);

        if (response.ok) {
          await UserRepository.deleteOne(userNew);

          if (authent === 1) auth.sendPasswordResetEmail(userData.email);

          alert(id ? "User updated successfully" : "User added successfully");

          props.history.push({
            pathname: "/users",
          });
        }
      } else alert("Error creating user with new email");
    }

    setLoadingSubmit(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isloading) return;
    // console.log('email', email)
    if (id) {
      handleAddUser(id);
    } else {
      if (mail) {
        await createAuthUser(userData.email.trim(), password);
      } else {
        await createAuthUser(userData.email.trim(), password);
        //handleAddUser(undefined) ---> FUNCION PARA QUE PUEDA CREAR UN USUARIO SIN TENER QUE AUTENTICARLO, FIJARSE QUE NOS DE PERMISOS PARA PONER ID RANDOM FIREBASE
      }
    }
  };
  // TODO: handle form submission

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckboxCourse = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      course: {
        ...prevState.course,
        [name]: checked,
      },
    }));
  };

  const handleCheckboxSign = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: checked ? 1 : 0,
    }));
  };

  const handleCheckboxSKY = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      SKY: {
        ...prevState.SKY,
        [name]: checked ? 1 : 0,
      },
    }));
  };

  // const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, checked } = e.target;
  //   setUserData((prevState) => ({
  //     ...prevState,
  //     [name]: checked,
  //   }));
  // };

  return (
    <div
      className="div-flex"
      style={{ marginTop: "110px", marginBottom: "30px" }}
    >
      <Navigation />

      {isloading ? (
        <Flex
          justify="center"
          style={{ height: "75vh" }}
          align="center"
          direction="column"
          gap={20}
        >
          <Loader size={60} />
          <p style={{ fontSize: 30, fontStyle: "italic" }}>Loading user</p>
        </Flex>
      ) : (
        <Container>
          <center>
            <h1>{id ? "Update Teacher" : "Add Teacher"}</h1>
          </center>
          <br />

          <form onSubmit={handleSubmit} className="form_add_user">
            <Flex
              justify="space-between"
              align="center"
              gap={20}
              className={styles.agrouped_input}
            >
              <div>
                <label className={styles.label}>Email*:</label>
                <InputGroup className={styles.container_input}>
                  <Form.Control
                    id="inputtext"
                    type="email"
                    name="email"
                    placeholder="user@gmail.com"
                    value={userData.email}
                    required
                    autoFocus
                    onChange={handleChangeText}
                  />
                </InputGroup>
              </div>

              {!id ? (
                <div>
                  <label className={styles.label}>Password*:</label>
                  <InputGroup className={styles.container_input}>
                    <Form.Control
                      id="inputtext"
                      type="password"
                      placeholder="********"
                      value={password}
                      autoFocus
                      required
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </InputGroup>
                </div>
              ) : (
                <div>
                  <label className={styles.label}>Birthday:</label>
                  <InputGroup className={styles.container_input}>
                    <Form.Control
                      max={new Date().toISOString().split("T")[0]}
                      id="inputtext"
                      type="date"
                      value={userData.birthday}
                      autoFocus
                      onChange={(event) =>
                        setUserData((prevState) => ({
                          ...prevState,
                          birthday: event.target.value,
                        }))
                      }
                    />
                  </InputGroup>
                </div>
              )}
            </Flex>

            <Flex
              justify="space-between"
              align="center"
              gap={20}
              className={styles.agrouped_input}
            >
              <div>
                <label className={styles.label}>Name*:</label>
                <InputGroup className={styles.container_input}>
                  <Form.Control
                    type="text"
                    name="name"
                    id="inputtextName"
                    placeholder=" John "
                    value={userData.name}
                    autoFocus
                    required
                    onChange={handleChangeText}
                  />
                </InputGroup>
              </div>
              <div>
                <label className={styles.label}>Last Name*:</label>
                <InputGroup className={styles.container_input}>
                  <Form.Control
                    type="text"
                    name="lastName"
                    id="inputtextLN"
                    placeholder=" Doe"
                    value={userData.lastName}
                    autoFocus
                    required
                    onChange={handleChangeText}
                  />
                </InputGroup>
              </div>
              {!id && (
                <div>
                  <label className={styles.label}>Birthday:</label>
                  <InputGroup className={styles.container_input}>
                    <Form.Control
                      //max date today
                      max={new Date().toISOString().split("T")[0]}
                      id="inputtext"
                      type="date"
                      value={userData.birthday}
                      autoFocus
                      onChange={(event) =>
                        setUserData((prevState) => ({
                          ...prevState,
                          birthday: event.target.value,
                        }))
                      }
                    />
                  </InputGroup>
                </div>
              )}
            </Flex>

            <Flex
              justify="space-between"
              align="center"
              gap={20}
              className={styles.agrouped_input}
            >
              <div>
                <label className={styles.label}>Origin Country*:</label>
                <InputGroup className={styles.container_input}>
                  <Form.Control
                    type="text"
                    name="country"
                    id="inputtextCountry"
                    placeholder=" Argentina"
                    value={userData.country}
                    autoFocus
                    required
                    onChange={handleChangeText}
                  />
                </InputGroup>
              </div>
              <div>
                <label className={styles.label}>Residence Country:</label>
                <Form.Control
                  type="text"
                  name="teach_country"
                  id="inputtextTeachCountry"
                  value={userData.teach_country}
                  placeholder="Argentina"
                  autoFocus
                  onChange={handleChangeText}
                />
              </div>
            </Flex>

            <Flex
              justify="space-between"
              align="center"
              gap={20}
              className={styles.agrouped_input}
            >
              <div>
                <label className={styles.label}>TTC Date:</label>
                <InputGroup className={styles.container_input}>
                  <Form.Control
                    type="text"
                    name="TTCDate"
                    id="inputtextTTCDate"
                    placeholder=" 2020-01-01"
                    value={userData.TTCDate}
                    autoFocus
                    onChange={handleChangeText}
                  />
                </InputGroup>
              </div>
              <div>
                <label className={styles.label}>Place TTC:</label>
                <InputGroup className={styles.container_input}>
                  <Form.Control
                    type="text"
                    name="placeTTC"
                    id="inputtextplaceTTC"
                    placeholder="Argentina"
                    value={userData.placeTTC}
                    autoFocus
                    onChange={handleChangeText}
                  />
                </InputGroup>
              </div>
            </Flex>

            <Flex
              justify="space-between"
              align="center"
              gap={20}
              className={styles.agrouped_input}
            >
              <div>
                <label className={styles.label}>Phone:</label>
                <InputGroup className={styles.container_input}>
                  <Form.Control
                    type="text"
                    name="phone"
                    id="inputtextPhone"
                    placeholder=" +54 9 11 1234 5678"
                    value={userData.phone}
                    autoFocus
                    onChange={handleChangeText}
                  />
                </InputGroup>
              </div>
              <div>
                <label className={styles.label}>Code:</label>
                <InputGroup className={styles.container_input}>
                  <Form.Control
                    type="text"
                    name="code"
                    id="inputtextCode"
                    placeholder="Insert Code"
                    value={userData.code}
                    autoFocus
                    onChange={handleChangeText}
                  />
                </InputGroup>
              </div>
            </Flex>

            <Flex
              justify="space-between"
              align="center"
              gap={20}
              className={styles.agrouped_input}
            >
              <div>
                <label className={styles.label}>Manual Code:</label>
                <InputGroup className={styles.container_input}>
                  <Form.Control
                    type="text"
                    name="manualCode"
                    id="inputtextManualCode"
                    placeholder="Insert Manual Code"
                    value={userData.manualCode}
                    autoFocus
                    onChange={handleChangeText}
                  />
                </InputGroup>
              </div>
              <div>
                <label className={styles.label}>Kriya Note Code:</label>
                <InputGroup className={styles.container_input}>
                  <Form.Control
                    type="text"
                    name="kriyaNotesCode"
                    id="inputtextKriyaNotesCode"
                    placeholder="Insert Code"
                    value={userData.kriyaNotesCode}
                    autoFocus
                    onChange={handleChangeText}
                  />
                </InputGroup>
              </div>
            </Flex>

            <div>
              <label className={styles.label}>Comment:</label>
              <InputGroup className={styles.container_input}>
                <Form.Control
                  type="text"
                  name="comment"
                  id="inputtextComment"
                  placeholder=" Comment"
                  value={userData.comment}
                  autoFocus
                  onChange={handleChangeText}
                />
              </InputGroup>
            </div>

            <div className={styles.separator} />

            {/* CHECKBOXES */}

            {!id && (
              <Form.Check
                className="inputradio"
                label="Enviar mail de bienvenida"
                type="checkbox"
                name="mail"
                defaultChecked={mail}
                value={mail ? 1 : 0}
                onChange={() => setMail(!mail)}
              />
            )}
            {!id && <div style={{ margin: "10px 0" }} />}
            <Form.Check
              className="inputradio"
              label="Sign the contract"
              type="checkbox"
              name="sign"
              id="sign"
              defaultChecked={userData.sign === 1}
              value={userData.sign}
              onChange={handleCheckboxSign}
            />

            <div className={styles.separator} />

            {/* SKY */}
            <div style={{ display: "flex" }}>
              <h4>Kriya Available</h4>
              <InputGroup style={{ width: "80%" }}>
                {Constants.SKY_OPTIONS.map((option) => (
                  <Form.Check
                    className="inputradio"
                    label={option.label}
                    type="checkbox"
                    name={option.key}
                    defaultChecked={
                      !!userData.SKY[option.key as keyof typeof userData.SKY]
                    }
                    value={
                      userData.SKY[option.key as keyof typeof userData.SKY]
                    }
                    id={option.key}
                    onChange={handleCheckboxSKY}
                  />
                ))}
              </InputGroup>
            </div>

            <div className={styles.separator} />

            {/* COURSES */}
            <h4>Courses</h4>
            <InputGroup className={styles.courses_container}>
              {Constants.COURSE_OPTIONS.map((option) => {
                return (
                  <div key={option.key}>
                    <label htmlFor={option.key}>{option.label}</label>
                    <Form.Check
                      type="checkbox"
                      name={option.key}
                      defaultChecked={
                        !!userData.course[
                          option.key as keyof typeof userData.course
                        ]
                      }
                      value={
                        userData.course[
                          option.key as keyof typeof userData.course
                        ]
                          ? 1
                          : 0
                      }
                      id={option.key}
                      onChange={handleCheckboxCourse}
                    />
                  </div>
                );
              })}
            </InputGroup>
            <br />
            {loadingSubmit && (
              <Flex justify="center" style={{ marginBottom: 20 }}>
                <Loader size={50} />
              </Flex>
            )}
            <div className="text-center">
              <Button
                type="submit"
                id="mybutton"
                disabled={isloading || loadingSubmit}
              >
                {loadingSubmit
                  ? "Loading..."
                  : id
                  ? "Update Teacher"
                  : "Add Teacher"}
              </Button>
            </div>
          </form>
        </Container>
      )}
    </div>
  );
};

export default AddUserPage;
