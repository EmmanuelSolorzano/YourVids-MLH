import React, { Component } from 'react';
import AuthService from '../AuthService/AuthService';
import NavScroll from '../NavScroll/NavScroll';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';

import './SignIn.css'


class Login extends Component {
  
  state = {
    username: '',
    password: '',
    error: '',
  };

  handleLogin = () => {
    const { username, password } = this.state;

    AuthService.login(username, password)
      .then(data => {
        if (data.access) {
        } else {
          this.setState({ error: 'Credenciales inválidas' });
        }
      })
      .catch(error => {
        console.error('Error al iniciar sesión:', error);
        this.setState({ error: 'Error al iniciar sesión' });
      });
  };

  render() {
    
    const { username, password, error } = this.state;
    return (
      <div>
        <NavScroll />
        <div className='login'>

        <Form>
          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label className='loginP'>Nombre de Usuario</Form.Label>
            <Form.Control type="email" placeholder="Usuario" value={username}
            onChange={e => this.setState({ username: e.target.value })}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupPassword">
            <Form.Label className='loginP'>Contraseña</Form.Label>
            <Form.Control type="password" placeholder="Contraseña" value={password}
            onChange={e => this.setState({ password: e.target.value })}/>
          </Form.Group>
        </Form>
        <Link className="search-buttonPlog" onClick={this.handleLogin}>
            <div className="search-buttonlog">
                Iniciar sesión
            </div>
          </Link>
          {error && <p>{error}</p>}
        </div>
      </div>
    );
  }
}

export default Login;
