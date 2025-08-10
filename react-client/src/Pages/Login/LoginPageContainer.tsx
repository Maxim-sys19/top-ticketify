import React from 'react';
import {NavLink} from 'react-router-dom';
import {Col, Row} from "react-bootstrap";
import LoginFormWrapper from "./LoginFormWrapper";
import LoginWithGoogle from "./LoginWithGoogle";

const LoginPageContainer = () => {
  return (
    <div className="text-center mt-4">
      <h1>Login Page</h1>
      <Row>
        <Col className="bg-body-secondary p-5" sm={{offset: 3, span: 6}}>
          <LoginFormWrapper />
          <Col>
            <NavLink to="/forgot-password">forgot password</NavLink> <br/>
            <LoginWithGoogle />
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default LoginPageContainer;