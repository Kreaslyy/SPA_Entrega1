import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, makeStyles, Snackbar, Card, CardContent } from '@material-ui/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

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
  avatar: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: theme.spacing(2),
  },
  followersContainer: {
    marginTop: theme.spacing(4),
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  followersCard: {
    width: '48%',
    padding: theme.spacing(2),
  },
  followingsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  followersListItem: {
    marginBottom: theme.spacing(1),
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
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);

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

    const fetchFollowersAndFollowings = async () => {
      const db = firebase.firestore();
      const userId = props.userId;

      try {
        const followersSnapshot = await db.collection('followers').doc(userId).collection('userFollowers').get();
        const followersData = followersSnapshot.docs.map((doc) => doc.id);
        setFollowers(followersData);

        const followingsSnapshot = await db.collection('followings').doc(userId).collection('userFollowings').get();
        const followingsData = followingsSnapshot.docs.map((doc) => doc.id);
        setFollowings(followingsData);
      } catch (error) {
        console.error('Error al obtener los seguidores y seguidos: ', error);
      }
    };

    fetchUserData();
    fetchFollowersAndFollowings();
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
        <Typography variant="h5" gutterBottom>
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
        <div className={classes.followersContainer}>
          <Card className={classes.followersCard}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Seguidores
              </Typography>
              {followers.length > 0 ? (
                <ul className={classes.followingsList}>
                  {followers.map((follower) => (
                    <li key={follower} className={classes.followersListItem}>
                      {follower}
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography variant="body1">No tienes seguidores</Typography>
              )}
            </CardContent>
          </Card>
          <Card className={classes.followersCard}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Seguidos
              </Typography>
              {followings.length > 0 ? (
                <ul className={classes.followingsList}>
                  {followings.map((following) => (
                    <li key={following} className={classes.followersListItem}>
                      {following}
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography variant="body1">No estás siguiendo a nadie</Typography>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default UserProfile;