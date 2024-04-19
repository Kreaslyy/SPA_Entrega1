import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, makeStyles, Snackbar } from '@material-ui/core';
import userProfileData from '../data/userProfileData.json';

const useStyles = makeStyles((theme) => ({
  formContainer: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  textField: {
    margin: theme.spacing(1),
    width: '100%',
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

const UserProfile = () => {
  const classes = useStyles();
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    bio: '',
    avatar: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Cargar los datos mockeados del usuario al montar el componente
  useEffect(() => {
    setUserInfo(userProfileData);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulación de envío de datos actualizados al servidor
    setTimeout(() => {
      // Lógica para enviar los datos actualizados al servidor
      console.log('Enviar datos actualizados:', userInfo);
      // Después de recibir una respuesta exitosa del servidor
      setSnackbarOpen(true); // Mostrar mensaje de confirmación
    }, 1000);
  };

  return (
    <Container maxWidth="sm">
      <div className={classes.formContainer}>
        <Typography variant="h5" gutterBottom>Editar Perfil</Typography>
        <form onSubmit={handleSubmit} className={classes.form}>
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
          <TextField
            className={classes.textField}
            label="URL del avatar"
            name="avatar"
            value={userInfo.avatar}
            onChange={handleInputChange}
          />
          {/* Agrega más campos de formulario según sea necesario */}
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            type="submit"
          >
            Guardar cambios
          </Button>
        </form>
        {/* Snackbar para mostrar mensaje de confirmación */}
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
