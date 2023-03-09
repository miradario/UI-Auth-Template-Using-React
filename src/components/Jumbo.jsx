import React, { Component } from "react";
import { Jumbotron } from "react-bootstrap";

class Jumbo extends Component {
  state = { greet: "" };

  componentWillMount() {
    let currHr = new Date().getHours();
    if (currHr < 12 && currHr >= 0)
      this.setState({ greet: "Good Morning, JGD." });
    else if (currHr >= 12 && currHr < 18)
      this.setState({ greet: "Good Afternoon, JGD." });
    else if (currHr >= 18) this.setState({ greet: "Good Evening, JGD." });
  }

  render() {
    return (
      <div style={{ marginTop: "120px" }}>
        <Jumbotron className="Jumbotron">
          <div className="overflow">
            <h1 className="jumbo_transform">{this.state.greet}</h1>
          </div>
        </Jumbotron>
      </div>
    );
  }
}

export default Jumbo;
