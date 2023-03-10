import React, { Component } from "react";
import Navigation from "./Navigation";
import { db, auth } from "../firebase/firebase";
import Footer from "./Footer";

const INITIAL_STATE = {
  error: null,
};

class UserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
    };
  }

  //delete auth user from firebase
  deleteAuthUser = (id, status) => {
    db.ref("users/" + id).update({
      inactive: status,
    });
    alert("User status changed");
    window.location.reload(false);
  };

  getData() {
    db.ref("users/").on("value", (snapshot) => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          id: item,
          name: items[item].name,
          email: items[item].email,
          phone: items[item].phone,
          address: items[item].address,
          inactive: items[item].inactive,
        });
      }
      this.setState({
        items: newState,
      });
    });
  }

  componentDidMount() {
    db.ref("users/")
      .once("value")
      .then((snapshot) => {
        console.log("snapshot:", snapshot);
        if (snapshot) {
          // console.log(snapshot.val());
          this.setState({
            items: snapshot.val(),
          });
          console.log("items:", this.state.items);
        }
      })
      .catch((e) => {
        alert(e.message);
      });
  }

  state = { ...INITIAL_STATE };
  re;

  render() {
    return (
      <div className="App">
        <div>
          <Navigation />
          <br />
          <br />
          <br />
          <br />

          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h1>Teachers</h1>
                <button className="btn btn-primary">
                  <a href="/add-users" style={{ color: "white" }}>
                    Add Teacher
                  </a>
                </button>
                <br />
                <br />

                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Phone</th>
                      <th scope="col">Country</th>
                      <th scope="col">Long</th>
                      <th scope="col">Short</th>
                      <th scope="col">Art Excel</th>
                      <th scope="col">Status</th>

                      <th scope="col">Action</th>
                      <th scope="col">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(this.state.items).map((key) => (
                      //check if inactive
                      <tr
                        key={key}
                        style={{
                          backgroundColor: this.state.items[key].inactive
                            ? "orange"
                            : "",
                        }}
                      >
                        <td>{this.state.items[key].name}</td>
                        <td>{this.state.items[key].email}</td>
                        <td>{this.state.items[key].phone}</td>
                        <td>{this.state.items[key].country}</td>
                        <td>
                          {this.state.items[key].SKY.long === 1 ? "On" : "Off"}
                        </td>
                        <td>
                          {" "}
                          {this.state.items[key].SKY.short === 1 ? "On" : "Off"}
                        </td>
                        <td>
                          {" "}
                          {this.state.items[key].SKY.ae === 1 ? "On" : "Off"}
                        </td>
                        <td>
                          {this.state.items[key].inactive
                            ? "Disable"
                            : "Enable"}
                        </td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              this.props.history.push({
                                pathname: "/add-users",
                                state: { key: key },
                              });
                            }}
                          >
                            Edit
                          </button>
                        </td>
                        <td>
                          <button
                            style={{
                              backgroundColor: this.state.items[key].inactive
                                ? ""
                                : "orange",
                            }}
                            className={
                              this.state.items[key].inactive
                                ? "btn btn-danger"
                                : "btn btn-success"
                            }
                            onClick={() => {
                              this.deleteAuthUser(
                                key,
                                !this.state.items[key].inactive
                              );
                            }}
                          >
                            {this.state.items[key].inactive
                              ? "Activate"
                              : "Inactive"}
                          </button>
                        </td>
                        <td>
                          {/* send a forgot password */}
                          <button
                            className="btn btn-info"
                            style={{ fontSize: 8 }}
                            onClick={() => {
                              auth
                                .sendPasswordResetEmail(
                                  this.state.items[key].email
                                )
                                .then(function () {
                                  alert("Password reset email sent");
                                })
                                .catch(function (error) {
                                  alert(error.message);
                                });
                            }}
                          >
                            Reset Password
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    );
  }
}

export default UserPage;
