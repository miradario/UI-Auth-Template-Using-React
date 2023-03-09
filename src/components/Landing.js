import React, { Component } from "react";
import Navigation from "./Navigation";
import Jumbo from "./Jumbo";
import Footer from "./Footer";

const INITIAL_STATE = {
  error: null,
};

class Landing extends Component {
  state = { ...INITIAL_STATE };

  render() {
    return (
      <div className="App">
        <div>
          <Navigation />
          <div className="container">
            <Jumbo />
          </div>

          <Footer />
        </div>
      </div>
    );
  }
}

export default Landing;
