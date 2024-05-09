import React from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import { checkAuth } from '../Router';

const Navigation = () => {
  const history = useHistory();

  const handleLogout = () => {
    document.cookie = "loggedIn=";
    history.push('/login');
    window.location.reload();
  };

  return checkAuth() ? (
    <>
      <AppBar position="relative">
        <Toolbar className="navbar">
          <Typography variant="h6" style={{ flexGrow: "1" }}>
            TdeA Shop
          </Typography>
          <ul className="nav-list">
            <li className="nav-list-item">
              <Link to="/">Inicio</Link>
            </li>
            <li className="nav-list-item">
              <Link to="/listings">Productos</Link>
            </li>
            <li className="nav-list-item">
              <Link to="/add">Añadir Producto</Link>
            </li>
            <li className="nav-list-item">
              <Link to="/profile">Perfil</Link>
            </li>
            <li className="nav-list-item" onClick={handleLogout}>
              Cerrar Sesión
            </li>
          </ul>
        </Toolbar>
      </AppBar>
      <div className="logged-in">Logged in as: username</div>
    </>
  ) : (
    <AppBar position="relative">
      <Toolbar className="navbar">
        <Typography variant="h6" style={{ flexGrow: "1" }}>
          TdeA Shop
        </Typography>
        <ul className="nav-list">
          <li className="nav-list-item">
            <Link to="/login">Login</Link>
          </li>
          <li className="nav-list-item">
            <Link to="/about">About</Link>
          </li>
        </ul>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;