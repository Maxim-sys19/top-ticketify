import React, {useEffect} from 'react';
import {Link, NavLink, useNavigate} from "react-router-dom";
import './navbar.scss'
import {Button, Container, Nav, Navbar, Offcanvas} from "react-bootstrap";
import {useAppDispatch, useAppSelector} from "../../hooks/useApiHooks";
import {profileAction} from "../../redux/api/profile/profile.api.service";
import {logoutAction} from "../../redux/api/profile/logout.api.service";

const BaseNavBar = ({isAdmin}: {isAdmin: boolean}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const token = useAppSelector(state => state.jwtToken.token);
  const {name} = useAppSelector(state => state.profile.user)

  useEffect(() => {
    if (token) {
      dispatch(profileAction())
    }
  }, [token, dispatch])

  const onLogout = () => {
    dispatch(logoutAction())
    navigate('/login')
  }

  return (
    <Navbar expand="lg" className="p-4 bg-body-secondary">
      <Container fluid>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Brand>
          <NavLink className="nav_link" to="/">TopTicketify</NavLink>
        </Navbar.Brand>
        <Navbar.Offcanvas id="basic-navbar-nav" placement="start" className="bg-body-secondary">
          <Offcanvas.Header closeButton>
            <NavLink className="nav_link" to="/">TopTicketify</NavLink>
          </Offcanvas.Header>
          <Offcanvas.Body className="navbar-expand-lg">
            {
              token
                ? <Nav className="nav_container">
                  <h4 className="m-4">{name}</h4>
                  {
                    isAdmin &&
                    <Link to="/dashboard" className="btn btn-sm btn-outline-success m-2" aria-controls="admin-nav">
                      admin
                    </Link>
                  }
                  <Button size="sm" variant="outline-danger" onClick={onLogout}>
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