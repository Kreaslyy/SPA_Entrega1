import React, { useState } from 'react';
import { Button, TextField, Box, makeStyles, Rating, Typography } from '@material-ui/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    padding: theme.spacing(4),
    borderRadius: theme.spacing(1),
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: 500,
    width: '100%',
  },
  form: {
    width: '100%',
    textAlign: 'center',
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
  imagePreview: {
    maxWidth: '100%',
    marginBottom: theme.spacing(2),
    borderRadius: theme.spacing(1),
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  ratingContainer: {
    marginBottom: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(3),
    fontWeight: 'bold',
    textAlign: 'center',
  },
}));

const AddListing = (props) => {
  const classes = useStyles();
  const [listing, setListing] = useState({
    Name: '',
    Precio: '',
    Marca: '',
    Description: '',
    Rate: 0,
    ImageUrl: '',
  });
  const [imagePreview, setImagePreview] = useState('');

  const dispatch = useDispatch();

  const handleTextChange = (e) => {
    const newListing = { ...listing };
    newListing[e.target.id] = e.target.value;
    setListing(newListing);
  };

  const handleRateChange = (event, newValue) => {
    setListing({ ...listing, Rate: newValue });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(file.name);

    fileRef.put(file).then(() => {
      fileRef.getDownloadURL().then((url) => {
        setListing({ ...listing, ImageUrl: url });
        setImagePreview(url);
      });
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...listing };

    if (props.userId) {
      payload.userId = props.userId;
    }

    payload.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    payload.updatedAt = firebase.firestore.FieldValue.serverTimestamp();

    props.db
      .collection('productos')
      .add(payload)
      .then((docRef) => {
        const newListing = { ...payload, id: docRef.id };
        dispatch({ type: 'ADD_LISTING', payload: newListing });
        setListing({
          Name: '',
          Precio: '',
          Marca: '',
          Description: '',
          Rate: 0,
          ImageUrl: '',
        });
        setImagePreview('');
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
  };

  return (
    <div className={classes.container}>
      <Box className={classes.formContainer}>
        <Typography variant="h5" className={classes.title}>
          Añadir Nuevo Producto
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            className={classes.textField}
            value={listing.Name}
            required
            id="Name"
            onChange={handleTextChange}
            label="Nombre"
            fullWidth
            variant="outlined"
          />
          <TextField
            className={classes.textField}
            value={listing.Precio}
            required
            id="Precio"
            onChange={handleTextChange}
            label="Precio"
            fullWidth
            variant="outlined"
          />
          <TextField
            className={classes.textField}
            value={listing.Marca}
            required
            id="Marca"
            onChange={handleTextChange}
            label="Marca"
            fullWidth
            variant="outlined"
          />
          <TextField
            className={classes.textField}
            value={listing.Description}
            required
            id="Description"
            onChange={handleTextChange}
            label="Descripción"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
          />
          <Box className={classes.ratingContainer}>
            <Rating
              value={listing.Rate}
              onChange={handleRateChange}
              precision={0.5}
            />
          </Box>
          <Box mt={2} display="flex" justifyContent="center" alignItems="center">
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="image-upload"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="image-upload">
              <Button variant="contained" component="span" className={classes.button}>
                Cargar Imagen
              </Button>
            </label>
          </Box>
          {listing.ImageUrl && (
            <img
              src={listing.ImageUrl}
              alt="Preview"
              className={classes.imagePreview}
            />
          )}
          <Box mt={2}>
            <Button
              className={classes.button}
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
            >
              Añadir Producto
            </Button>
          </Box>
        </form>
      </Box>
    </div>
  );
};

export default AddListing;