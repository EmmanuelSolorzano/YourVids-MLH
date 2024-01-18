import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import AuthService from '../AuthService/AuthService';
import React, { useState } from "react";
import "./NavScroll.css";
import logo from "./img/logo-cibruc.jpeg";

function NavScroll() {
  const handleLogout = () => {
    AuthService.logout();
  };
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')));
  return (
    <Navbar expand="lg" className="bg-body-tertiary" bg='light'>
      <Container fluid>
        <Navbar.Brand>
      <Link to="/" className="linksnav">
        <div className="heading-containernav">
          <img src={logo} className='logo'/>
          <h1 className='hnav'>
          Plataforma de<span className="hcolornav">&nbsp;cursos</span>
          </h1>
          </div>
      </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarScroll" />
      <Navbar.Collapse id="navbarScroll" className="justify-content-end">
      <Nav
            className=" my-lg-0"
            navbarScroll
          >
        {localStorage.getItem("auth") ? (
            <>
            {location.pathname !== '/' && (
                  <Nav.Link href={'/'} className="linksnav">Inicio</Nav.Link>
            )}
            {userData.username === "admin" && (
              <>
                      <Nav.Link href={`/channel/${userData.username}`} className="linksnav">Editar cursos</Nav.Link>
                      <Nav.Link href="/create" className="linksnav">Subir curso</Nav.Link>   
              </>
            )}
                  <Nav.Link onClick={handleLogout} className="linksnav">Cerrar Sesión</Nav.Link>                  
                  
            </>
        ) :
          (
            <>
            {location.pathname !== '/' && (
                  <Nav.Link href={'/'} className="linksnav">Inicio</Nav.Link>
            )}
              <Nav.Link href="/signin" className="linksnav">Iniciar Sesión</Nav.Link>
              <Nav.Link href="/signup" className="linksnav">Registrarme</Nav.Link>
            </>
            )}    
      </Nav>  
      </Navbar.Collapse>        
      </Container>
    </Navbar>
  );
}

export default NavScroll;