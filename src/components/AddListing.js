import React, { useState } from 'react';
import { Button, TextField, Box, makeStyles } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  formContainer: {
    backgroundColor: '#f0f0f0',
    padding: theme.spacing(3),
    borderRadius: theme.spacing(1),
  },
  form: {
    maxWidth: 400,
    width: '100%',
    textAlign: 'center',
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
  },
  imagePreview: {
    maxWidth: '100%',
    marginBottom: theme.spacing(2),
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
      .then(() => {
        dispatch({ type: 'ADD_LISTING', payload });
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
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            className={classes.textField}
            value={listing.Name}
            required
            id="Name"
            onChange={handleTextChange}
            label="Nombre"
            fullWidth
          />
          <TextField
            className={classes.textField}
            value={listing.Precio}
            required
            id="Precio"
            onChange={handleTextChange}
            label="Precio"
            fullWidth
          />
          <TextField
            className={classes.textField}
            value={listing.Marca}
            required
            id="Marca"
            onChange={handleTextChange}
            label="Marca"
            fullWidth
          />
          <TextField
            className={classes.textField}
            value={listing.Description}
            required
            id="Description"
            onChange={handleTextChange}
            label="Descripcion"
            fullWidth
            multiline
            rows={4}
          />
          <Rating
            value={listing.Rate}
            onChange={handleRateChange}
            precision={0.5}
          />
          <TextField
            className={classes.textField}
            value={listing.ImageUrl}
            id="ImageUrl"
            onChange={handleTextChange}
            label="URL de la imagen"
            fullWidth
          />
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
              Save
            </Button>
          </Box>
        </form>
      </Box>
    </div>
  );
};

export default AddListing;