// add user component

import React, { useEffect, useState } from "react";
import { Button, Form, InputGroup, Container } from "react-bootstrap";
import Navigation from "./Navigation";
import { db } from "../firebase/firebase";
import { auth } from "../firebase/firebase";

const AddUserPage = (props) => {
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [lastName, setLastname] = useState("");
  const [country, setCountry] = useState("");
  const [code, setCode] = useState("");
  const [long, setLong] = useState(false);
  const [short, setShort] = useState(false);
  const [ae, setAe] = useState(false);
  const [TTCDate, setTTCDate] = useState(false);
  const [sign, setSign] = useState(false);

  const [inactive, setInactive] = useState(false);
  const [error, setError] = useState(null);
  const [isloading, setIsLoading] = useState(false);

  // create async createAuthUser

  const createAuthUser = async (email, password) => {
    setIsLoading(true);
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        //save the user id created into the state
        const userNew = authUser.user.uid;
        console.log("userNew", userNew);

        handleAddUser(userNew);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  //get the key from parameter and set the data in the fields with useEffect

  useEffect(() => {
    console.log("props", props);
    const { key } = (props.location && props.location.state) || {};
    setId(key);
    //CHEKC IF THERE IS A PARMATER?

    console.log("id", key);
    if (key) {
      setIsLoading(true);
      db.ref("users/" + key)
        .once("value")
        .then((snapshot) => {
          console.log("snapshot:", snapshot);
          if (snapshot) {
            setPhone(snapshot.val().phone);
            setName(snapshot.val().name);
            setEmail(snapshot.val().email);
            setCountry(snapshot.val().country);
            setCode(snapshot.val().code);
            setLastname(snapshot.val().lastName);
            setTTCDate(snapshot.val().TTCDate);
            const long = snapshot.val().SKY.long === 1 ? true : false;
            setLong(long);
            setSign(snapshot.val().sign === 1 ? true : false);
            setShort(snapshot.val().SKY.short === 1 ? true : false);
            setAe(snapshot.val().SKY.ae === 1 ? true : false);
            setIsLoading(false);
          }
        })
        .catch((e) => {
          alert(e.message);
        });
    }
  }, [props]);

  const handleLong = (long) => {
    setLong(!long);
  };

  const handleShort = (short) => {
    setShort(!short);
  };

  const handleAe = (ae) => {
    setAe(!ae);
  };

  const handleSign = (sign) => {
    setSign(!sign);
  };

  const cleanFields = () => {
    setName("");
    setEmail("");
    setPassword("");
    setPhone("");
    setLastname("");
    setCountry("");
    setLong(false);
    setShort(false);
    setAe(false);
  };

  const handleAddUser = async (userNew) => {
    const long_1 = long ? 1 : 0;
    const short_1 = short ? 1 : 0;
    const ae_1 = ae ? 1 : 0;
    const sign_1 = sign ? 1 : 0;
    console.log("checks", long, short, ae);
    db.ref("users/" + userNew)
      .update({
        name: name,
        email: email,
        phone: phone,
        country: country,
        code: code,
        lastName: lastName,
        TTCDate: TTCDate,
        sign: sign_1,
        SKY: {
          long: long_1,
          short: short_1,
          ae: ae_1,
        },
      })
      .then((data) => {
        //success callback
        if (id) {
          alert("User updated successfully");
        } else {
          alert("User added successfully");
        }
        setIsLoading(false);
        props.history.push({
          pathname: "/users",
        });
      })
      .catch((error) => {
        //error callback
        console.log("error ", error);
      });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("email", email);
    if (id) {
      handleAddUser(id);
    } else {
      await createAuthUser(email, password);
    }
  };
  // TODO: handle form submission

  return (
    <div className="div-flex" style={{ marginTop: "110px" }}>
      <Navigation />

      <Container>
        <center>
          <h1>{id ? "Update Teacher" : "Add Teacher"}</h1>
        </center>
        <br />
        {isloading ? ( // if loading show 'loading...'
          <div id="preloader"></div>
        ) : (
          <form onSubmit={handleSubmit}>
            <InputGroup>
              <InputGroup.Prepend className="inputlabel">
                Email
              </InputGroup.Prepend>
              <Form.Control
                id="inputtext"
                type="email"
                placeholder="user@gmail.com"
                value={email}
                required
                autoFocus
                // change widht of input
                style={{ width: "300px" }}
                onChange={(event) => setEmail(event.target.value)}
              />
            </InputGroup>

            <br />
            {!id ? (
              <InputGroup>
                <InputGroup.Prepend className="inputlabel">
                  Password
                </InputGroup.Prepend>
                <Form.Control
                  id="inputtext"
                  type="password"
                  placeholder="********"
                  value={password}
                  required
                  autoFocus
                  // change widht of input
                  style={{ width: "300px" }}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </InputGroup>
            ) : null}
            <br />
            <InputGroup>
              <InputGroup.Prepend className="inputlabel">
                Name:
              </InputGroup.Prepend>
              <Form.Control
                type="text"
                name="name"
                id="inputtextName"
                placeholder=" John "
                value={name}
                autoFocus
                required
                onChange={(event) => setName(event.target.value)}
              />
            </InputGroup>
            <br />
            <InputGroup>
              <InputGroup.Prepend className="inputlabel">
                Last Name:
              </InputGroup.Prepend>
              <Form.Control
                type="text"
                name="lastName"
                id="inputtextLN"
                placeholder=" Doe"
                value={lastName}
                autoFocus
                required
                onChange={(event) => setLastname(event.target.value)}
              />
            </InputGroup>
            <br />
            <InputGroup>
              <InputGroup.Prepend className="inputlabel">
                Country:
              </InputGroup.Prepend>
              <Form.Control
                type="text"
                name="country"
                id="inputtextCountry"
                placeholder=" Argentina"
                value={country}
                autoFocus
                required
                onChange={(event) => setCountry(event.target.value)}
              />
            </InputGroup>
            <br />
            <InputGroup>
              <InputGroup.Prepend className="inputlabel">
                Code:
              </InputGroup.Prepend>
              <Form.Control
                type="text"
                name="code"
                id="inputtextCode"
                placeholder=" 9906"
                value={code}
                autoFocus
                required
                onChange={(event) => setCode(event.target.value)}
              />
            </InputGroup>
            <br />
            <InputGroup>
              <InputGroup.Prepend className="inputlabel">
                Phone:
              </InputGroup.Prepend>
              <Form.Control
                type="text"
                name="phone"
                id="inputtextPhone"
                placeholder=" +54 9 11 1234 5678"
                value={phone}
                autoFocus
                required
                onChange={(event) => setPhone(event.target.value)}
              />
            </InputGroup>
            <br />
            <InputGroup>
              <InputGroup.Prepend className="inputlabel">
                TTC Date:
              </InputGroup.Prepend>
              <Form.Control
                type="date"
                name="ttcdate"
                id="inputtextTTCDate"
                placeholder=" 2020-01-01"
                value={TTCDate}
                autoFocus
                required
                onChange={(event) => setTTCDate(event.target.value)}
              />
            </InputGroup>
            <Form.Check
              className="inputradio"
              label="Sign the contract"
              type="checkbox"
              name="Sing"
              defaultChecked={sign}
              value={sign}
              onChange={() => handleSign(sign)}
            />
            <br />
            <InputGroup style={{ width: "60%" }}>
              <Form.Label className="inputlabel">Kriya Available</Form.Label>
              <br />
              <Form.Check
                className="inputradio"
                label={"Long"}
                type="checkbox"
                name="Long"
                defaultChecked={long}
                value={long}
                onChange={() => handleLong(long)}
              />
              <Form.Check
                className="inputradio"
                label="Short"
                type="checkbox"
                name="Short"
                defaultChecked={short}
                value={short}
                onChange={() => handleShort(short)}
              />
              <Form.Check
                className="inputradio"
                label="Art Excel"
                type="checkbox"
                name="ArtExcel"
                defaultChecked={ae}
                value={ae}
                onChange={() => handleAe(ae)}
              />
            </InputGroup>
            <br />
            <div className="text-center">
              <Button type="submit" id="mybutton">
                {id ? "Update Teacher" : "Add Teacher"}
              </Button>
            </div>
          </form>
        )}
      </Container>
    </div>
  );
};

export default AddUserPage;

/*
class AddUserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      name: "",
      email: "",
      phone: "",
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  onSubmit(event) {
    event.preventDefault();
    console.log("name");

    const { email, name, phone } = this.state;
    console.log("name2", name);

    db.ref("users/")
      .push({
        name: name,
        email: email,
        phone: phone,
      })
      .then((data) => {
        //success callback
        console.log("data ", data);
      })
      .catch((error) => {
        //error callback
        console.log("error ", error);
      });
  }

  render() {
    return (
      <div className="App">
        <div>
          <Navigation />
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h1>Add Teacher</h1>
                <br />
                <br />
                <Form onSubmit={this.onSubmit}>
                  <Form.Group controlId="formBasicName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Name"
                      name="name"
                      value={this.state.name}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter Email"
                      name="email"
                      value={this.state.email}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicPhone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Phone"
                      name="phone"
                      value={this.state.phone}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicAddress">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Address"
                      name="address"
                      value={this.state.address}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={this.state.password}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicPasswordConfirm">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirm Password"
                      name="password"
                      value={this.state.password}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicCheckboxLong">
                    <Form.Check name="long" type="checkbox" label="Long" />
                  </Form.Group>
                  <Form.Group controlId="formBasicCheckboxShort">
                    <Form.Check name="short" type="checkbox" label="Short" />
                  </Form.Group>
                  <Form.Group controlId="formBasicCheckboxAE">
                    <Form.Check name="ae" type="checkbox" label="AE" />
                  </Form.Group>
                  <br />
                  <br />

                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddUserPage;
*/
