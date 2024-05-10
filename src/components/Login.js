import React, { useState } from 'react';
import { TextField, Button, makeStyles, Typography } from '@material-ui/core';
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  form: {
    backgroundColor: '#ffffff',
    padding: theme.spacing(4),
    borderRadius: theme.spacing(1),
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: 400,
    width: '100%',
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
    backgroundColor: '#3f51b5',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#283593',
    },
  },
  googleButton: {
    marginTop: theme.spacing(2),
    backgroundColor: '#ffffff',
    color: '#3f51b5',
    border: '2px solid #3f51b5',
    '&:hover': {
      backgroundColor: '#3f51b5',
      color: '#ffffff',
    },
  },
  title: {
    marginBottom: theme.spacing(3),
    fontWeight: 'bold',
    textAlign: 'center',
  },
}));

const Login = (props) => {
  const classes = useStyles();
  const provider = new GoogleAuthProvider();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleCreateUser = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        document.cookie = 'loggedIn=true';
        debugger;
        document.cookie = `user=${JSON.stringify(user)}`;
        history.push('/listing');
        window.location.reload();
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/email-already-in-use') {
          alert('El usuario ya está registrado');
        } else {
          alert(errorCode);
        }
      });
  };

  const handleLoginEmail = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('user', user);
        debugger;
        document.cookie = 'loggedIn=true';
        document.cookie = `user=${JSON.stringify(user)}`;
        history.push('/listing');
        window.location.reload();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`Error ${errorCode} - ${errorMessage}`);
      });
  };

  const handleGoogle = () => {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log(user);
        document.cookie = 'loggedIn=true';
        document.cookie = `user=${JSON.stringify(user)}`;
        history.push('/listing');
        window.location.reload();
      })
      .catch((error) => {
        const errorMessage = error.message;
        const email = error.customData.email;
        console.log(`Error ${email} - ${errorMessage}`);
      });
  };

  return (
    <div className={classes.root}>
      <div className={classes.form}>
        <Typography variant="h5" className={classes.title}>
          Iniciar Sesión
        </Typography>
        <TextField
          className={classes.textField}
          required
          placeholder="Usuario"
          label="Usuario"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          fullWidth
          variant="outlined"
        />
        <TextField
          className={classes.textField}
          required
          placeholder="Contraseña"
          type="password"
          label="Contraseña"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          fullWidth
          variant="outlined"
        />
        <Button
          fullWidth
          variant="contained"
          className={classes.button}
          onClick={handleCreateUser}
        >
          Crear usuario
        </Button>
        <Button
          fullWidth
          variant="contained"
          className={classes.button}
          onClick={handleLoginEmail}
        >
          Iniciar sesión
        </Button>
        <Button
          fullWidth
          variant="contained"
          className={classes.googleButton}
          onClick={handleGoogle}
        >
          Iniciar sesión con Google
        </Button>
      </div>
    </div>
  );
};

export default Login;