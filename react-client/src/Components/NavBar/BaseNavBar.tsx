import React, {useEffect} from 'react';
import {NavLink} from "react-router-dom";
import './navbar.scss'
import {Container, Nav, Navbar, Offcanvas, Button} from "react-bootstrap";
import {useAppDispatch, useAppSelector} from "../../hooks/useApiHooks";
import {logout} from "../../redux/api/auth/authToken.slice";
import {profileApiThunk} from "../../redux/api/profile/profile.api.service";

const BaseNavBar = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(state => state.jwtToken.token);

  useEffect(() => {
    dispatch(profileApiThunk())
  }, [dispatch]);

  return (
    <Navbar expand="lg" className="p-4 bg-body-secondary">
      <Container fluid>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Brand>
          <NavLink className="nav_link" to="/">TopTicketify</NavLink>
        </Navbar.Brand>
        <Navbar.Offcanvas id="basic-navbar-nav" placement="start" className="bg-body-secondary">
          <Offcanvas.Body className="navbar-expand-lg">
            {
              token
                ? <Nav className="nav_container">
                  <h4 className="m-4">profile</h4>
                  <Button size="sm" variant="outline-danger" onClick={() => dispatch(logout())}>
                    logout
                  </Button>
                </Nav>
                : <Nav>
                  <NavLink to="/register" className="nav_link m-2">register</NavLink>
                  <NavLink to="/login" className="nav_link m-2">login</NavLink>
                </Nav>
            }
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  )
}

export default BaseNavBar;