import { useState, FormEvent } from "react";
import { Button, Form, InputGroup, Container } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { auth } from "../firebase";
import Footer from "./Footer";
import Navigation from "./Navigation";
import { Constants } from "../constants/constants";
import { ADMIN_CONFIG } from "../firebase/.env";

const INITIAL_STATE = {
  email: "",
  password: "",
  internalCode: "",
};

interface SignInFormProps {
  history: any;
}

const SignInPage = ({ history }: SignInFormProps) => {
  return (
    <div className="div-flex" style={{ marginTop: "110px" }}>
      <Navigation />
      <center>
        <SignInForm history={history} />
        <br />
        <hr />
        <Footer />
      </center>
    </div>
  );
};

const SignInForm = ({ history }: SignInFormProps) => {
  const [form, setForm] = useState(INITIAL_STATE);

  const { email, password, internalCode } = form;
  const isInvalid = password === "" || email === "";

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (internalCode !== ADMIN_CONFIG.internalCode) {
      alert("Invalid Admin Code");
      return;
    }

    try {
      const userCredential = await auth.doSignInWithEmailAndPassword(
        email,
        password
      );

      if (!userCredential.user) throw new Error("No user credential returned");

      localStorage.setItem("email", userCredential.user.email || "");

      setForm(INITIAL_STATE);
      history.push(Constants.ROUTES.LANDING);
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="inputclass">
      <Container>
        <center>
          <h2 id="mytexth2">Sign In</h2>
          <Form onSubmit={onSubmit}>
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
                onChange={(e) => handleChange("email", e.target.value)}
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
                onChange={(e) => handleChange("password", e.target.value)}
              />
            </InputGroup>
            <br />
            <InputGroup>
              <InputGroup.Prepend className="inputlabel">
                Admin Code
              </InputGroup.Prepend>
              <Form.Control
                id="inputtext"
                type="password"
                placeholder="Internal Code"
                value={internalCode}
                required
                onChange={(e) => handleChange("internalCode", e.target.value)}
              />
            </InputGroup>
            <br />
            <div className="text-center">
              <Button disabled={isInvalid} type="submit" id="mybutton">
                Sign In
              </Button>
            </div>
          </Form>
          <hr />
        </center>
      </Container>
    </div>
  );
};

export default withRouter(SignInPage);
export { SignInForm };
