import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, makeStyles, Snackbar } from '@material-ui/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const useStyles = makeStyles((theme) => ({
  formContainer: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: theme.spacing(4),
    borderRadius: theme.spacing(1),
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: 500,
    width: '100%',
  },
  textField: {
    margin: theme.spacing(1),
    width: '100%',
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#3f51b5',
      },
      '&:hover fieldset': {
        borderColor: '#283593',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#283593',
      },
    },
  },
  button: {
    marginTop: theme.spacing(2),
    backgroundColor: '#3f51b5',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#283593',
    },
  },
  avatar: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: theme.spacing(2),
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  title: {
    marginBottom: theme.spacing(3),
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#3f51b5',
  },
}));

const UserProfile = (props) => {
  const classes = useStyles();
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    bio: '',
    avatar: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const db = firebase.firestore();
      const userId = props.userId;

      try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setUserInfo({
            username: userData.username || '',
            email: userData.email || '',
            bio: userData.bio || '',
            avatar: userData.avatar || '',
          });
        } else {
          console.log('No se encontró el usuario');
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario: ', error);
      }
    };

    fetchUserData();
  }, [props.userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const db = firebase.firestore();
    const userId = props.userId;

    const userData = {
      ...userInfo,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    db.collection('users')
      .doc(userId)
      .set(userData, { merge: true })
      .then(() => {
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error('Error al actualizar los datos del usuario: ', error);
      });
  };

  return (
    <Container maxWidth="sm">
      <div className={classes.formContainer}>
        <Typography variant="h5" className={classes.title}>
          Editar Perfil
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form}>
          <img className={classes.avatar} src={userInfo.avatar} alt="Avatar" />
          <TextField
            className={classes.textField}
            label="URL del avatar"
            name="avatar"
            value={userInfo.avatar}
            onChange={handleInputChange}
          />
          <br />
          <TextField
            className={classes.textField}
            label="ID de usuario"
            value={props.userId}
            disabled
          />
          <TextField
            className={classes.textField}
            label="Nombre de usuario"
            name="username"
            value={userInfo.username}
            onChange={handleInputChange}
            required
          />
          <TextField
            className={classes.textField}
            label="Correo electrónico"
            name="email"
            type="email"
            value={userInfo.email}
            onChange={handleInputChange}
            required
          />
          <TextField
            className={classes.textField}
            label="Biografía"
            name="bio"
            multiline
            rows={4}
            value={userInfo.bio}
            onChange={handleInputChange}
          />
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            type="submit"
          >
            Guardar cambios
          </Button>
        </form>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          message="Los cambios se guardaron correctamente"
        />
      </div>
    </Container>
  );
};

export default UserProfile;