import React, { useState } from 'react';
import AuthService from '../AuthService/AuthService';
import NavScroll from '../NavScroll/NavScroll';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import '../SignIn/SignIn.css'
import API from '../Enviroment/API'

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [error, setError] = useState('');

  const handleSignup = () => {
    // Validations
    if (!email || !username || !password || !password2 || !first_name || !last_name) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
      setError('Ingrese un correo electrónico válido');
      return;
    }

    if (password !== password2) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError('La contraseña debe tener al menos 8 caracteres, una mayúscula y un número');
      return;
    }

    // If all validations pass, proceed with registration
    const userData = {
      email,
      username,
      password,
      password2,
      first_name,
      last_name,
    };

    fetch(`${API}/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    .then(response => {
      response.json()
      if (response.ok) {      
        AuthService.login(username, password)
      }
      else{
        setError('Error al registrar al usuario, intente con otro nombre de usuario y/o una contraseña más segura.');
      }
    })
    .catch(error => {
      setError('Error al registrar al usuario, intente con otro nombre de usuario.');
      console.error('Error registering user:', error);
    });
  };

  return (
    <div>
      <NavScroll />
      <div className='login' style={{marginBottom: '4rem'}}>
        <h2 style={{marginBottom: '2rem'}}>Registro</h2>
        <Form>
          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label className='loginP'>Email</Form.Label>
            <Form.Control type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label className='loginP'>Nombre de Usuario</Form.Label>
            <Form.Control type="text" placeholder="Nombre de Usuario" value={username}
            onChange={e => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label className='loginP'>Contraseña</Form.Label>
            <Form.Control type="password" placeholder="Contraseña" value={password}
            onChange={e => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label className='loginP'>Confirmar contraseña</Form.Label>
            <Form.Control type="password" placeholder="Confirmar contraseña" value={password2}
            onChange={e => setPassword2(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label className='loginP'>Nombre</Form.Label>
            <Form.Control type="text" placeholder="Nombre" value={first_name}
            onChange={e => setFirstName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label className='loginP'>Apellido</Form.Label>
            <Form.Control type="text" placeholder="Apellido" value={last_name}
            onChange={e => setLastName(e.target.value)}
            />
          </Form.Group>
        </Form>
        <Link className="search-buttonPlog" >
            <div className="search-buttonlog" onClick={handleSignup}>
                Registrarme
            </div>
          </Link>


          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </div>
  );
}

export default Signup;
