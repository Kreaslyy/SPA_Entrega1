import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, makeStyles } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import { checkAuth } from '../Router';
import cookie from "cookie";

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: '#ffffff',
    boxShadow: 'none',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    textDecoration: 'none',
    color: '#3f51b5',
    fontWeight: 'bold',
  },
  navList: {
    display: 'flex',
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  navListItem: {
    marginLeft: theme.spacing(3),
  },
  navLink: {
    textDecoration: 'none',
    color: '#3f51b5',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    '&:hover': {
      color: '#283593',
    },
  },
  loggedInMessage: {
    marginTop: theme.spacing(2),
    textAlign: 'center',
    color: '#3f51b5',
  },
}));

const Navigation = () => {
  const classes = useStyles();
  const history = useHistory();
  const [user, setUser] = useState({});

  useEffect(() => {
    const cookies = cookie.parse(document.cookie);
    setUser(JSON.parse(cookies["user"] || '{}'));
  }, []);

  const handleLogout = () => {
    document.cookie = "loggedIn=";
    document.cookie = "user=";
    history.push('/login');
    window.location.reload();
  };

  return (
    <>
      <AppBar position="relative" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" component={Link} to="/" className={classes.title}>
            TdeA Shop
          </Typography>
          <ul className={classes.navList}>
            {checkAuth() ? (
              <>
                <li className={classes.navListItem}>
                  <Link to="/" className={classes.navLink}>Inicio</Link>
                </li>
                <li className={classes.navListItem}>
                  <Link to="/listings" className={classes.navLink}>Productos</Link>
                </li>
                <li className={classes.navListItem}>
                  <Link to="/add" className={classes.navLink}>Añadir Producto</Link>
                </li>
                <li className={classes.navListItem}>
                  <Link to="/profile" className={classes.navLink}>Perfil</Link>
                </li>
                <li className={classes.navListItem} onClick={handleLogout} style={{ cursor: 'pointer' }}>
                  <span className={classes.navLink}>Cerrar Sesión</span>
                </li>
              </>
            ) : (
              <>
                <li className={classes.navListItem}>
                  <Link to="/login" className={classes.navLink}>Login</Link>
                </li>
                <li className={classes.navListItem}>
                  <Link to="/about" className={classes.navLink}>About</Link>
                </li>
              </>
            )}
          </ul>
        </Toolbar>
      </AppBar>
      {user?.displayName && (
        <div className={classes.loggedInMessage}>
          Logged in as: {user.displayName}
        </div>
      )}
    </>
  );
};

export default Navigation;