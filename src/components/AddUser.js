// add user component

import React, { useState } from "react";
import { Button, Form, InputGroup, Container } from "react-bootstrap";
import Navigation from "./Navigation";
import { db } from "../firebase/firebase";
import { auth } from "../firebase/firebase";

function AddUserPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [lastName, setLastname] = useState("");
  const [country, setCountry] = useState("");
  const [long, setLong] = useState(false);
  const [short, setShort] = useState(false);
  const [ae, setAe] = useState(false);

  // create async createAuthUser

  const createAuthUser = async (email, password) => {
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

  const handleLong = (long) => {
    setLong(!long);
  };
  const handleShort = (short) => {
    setShort(!short);
  };
  const handleAe = (ae) => {
    setAe(!ae);
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
    console.log("user", userNew);
    db.ref("users/" + userNew)
      .update({
        name: name,
        email: email,
        phone: phone,
        country: country,
        lastName: lastName,
        SKY: {
          long: long_1,
          short: short_1,
          ae: ae_1,
        },
      })
      .then((data) => {
        //success callback

        alert("User added successfully");

        cleanFields();
      })
      .catch((error) => {
        //error callback
        console.log("error ", error);
      });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("email", email);

    await createAuthUser(email, password);
  };
  // TODO: handle form submission

  return (
    <div className="div-flex" style={{ marginTop: "110px" }}>
      <Navigation />

      <Container>
        <center>
          <h1>Add Teacher</h1>
        </center>
        <br />
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
          <InputGroup>
            <InputGroup.Prepend className="inputlabel">
              Password
            </InputGroup.Prepend>
            <Form.Control
              id="inputtext"
              type="password"
              placeholder="Password"
              value={password}
              required
              onChange={(event) => setPassword(event.target.value)}
            />
          </InputGroup>
          <br />
          <InputGroup>
            <InputGroup.Prepend className="inputlabel">
              Name:
            </InputGroup.Prepend>
            <Form.Control
              type="text"
              name="name"
              id="inputtext"
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
              id="inputtext"
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
              id="inputtext"
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
              Phone:
            </InputGroup.Prepend>
            <Form.Control
              type="text"
              name="phone"
              id="inputtext"
              placeholder=" +54 9 11 1234 5678"
              value={phone}
              autoFocus
              required
              onChange={(event) => setPhone(event.target.value)}
            />
          </InputGroup>
          <br />
          <InputGroup style={{ width: "60%" }}>
            <Form.Label className="inputlabel">Kriya Available</Form.Label>
            <br />
            <Form.Check
              className="inputradio"
              label="Long"
              type="checkbox"
              name="Long"
              value={long}
              onChange={() => handleLong(long)}
            />
            <Form.Check
              className="inputradio"
              label="Short"
              type="checkbox"
              name="Short"
              value={short}
              onChange={() => handleShort(short)}
            />
            <Form.Check
              className="inputradio"
              label="Art Excel"
              type="checkbox"
              name="ArtExcel"
              value={ae}
              onChange={() => handleAe(ae)}
            />
          </InputGroup>
          <br />
          <div className="text-center">
            <Button type="submit" id="mybutton">
              Create Teacher
            </Button>
          </div>
        </form>
      </Container>
    </div>
  );
}

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
