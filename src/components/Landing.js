import React, { Component } from "react";
import Navigation from "./Navigation";
import Jumbo from "./Jumbo";
import Footer from "./Footer";
import { auth } from "../firebase/firebase";

const INITIAL_STATE = {
  error: null,
};

class Landing extends Component {
  state = { ...INITIAL_STATE };

  handleClick = () => {
    console.log("clicked");
    if (auth.currentUser === null) {
      this.props.history.push({
        pathname: "/signin",
      });
    } else {
      this.props.history.push({
        pathname: "/users",
      });
    }
  };
  render() {
    return (
      <div className="App">
        <div>
          <Navigation />
          <div className="container" onClick={() => this.handleClick()}>
            <Jumbo />
          </div>

          <Footer />
        </div>
      </div>
    );
  }
}

export default Landing;
