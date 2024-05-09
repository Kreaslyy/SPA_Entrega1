import React, { useState } from 'react';
import { Typography, Box, Paper, makeStyles, TextField, Button } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating'; // Importar Rating desde @material-ui/lab
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const useStyles = makeStyles((theme) => ({
  detailsContainer: {
    padding: theme.spacing(3),
    maxWidth: 600,
    margin: 'auto',
    marginTop: theme.spacing(4),
  },
  imageContainer: {
    textAlign: 'center',
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: theme.spacing(1),
  },
  reviewContainer: {
    marginTop: theme.spacing(4),
  },
  reviewForm: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  ratingContainer: {
    marginBottom: theme.spacing(2),
  },
  commentField: {
    marginBottom: theme.spacing(2),
    width: '100%',
  },
  submitButton: {
    marginTop: theme.spacing(2),
  },
}));

const Details = (props) => {
  const classes = useStyles();
  const { id } = useParams();
  const listings = useSelector((state) => state.listings);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const [name, marca] = id.split('-');
  const listing = listings.find(
    (l) => l.Name === name && l.Marca === marca
  );

  if (!listing) {
    return <div>No se encontró el listado con el ID proporcionado.</div>;
  }

  const getImageUrl = (listing) => {
    if (listing.ImageUrl) {
      return listing.ImageUrl;
    } else if (listing.imageUrl) {
      return listing.imageUrl;
    } else {
      return null;
    }
  };

  const { Name, Description, imageUrl, Precio, Marca } = listing;

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmitReview = () => {
    const db = firebase.firestore();
    const userId = props.userId; // Asumiendo que props.userId está disponible

    const reviewData = {
      productId: `${Name}${Marca}`, // Combinación de Name y Marca como referencia al producto
      userId,
      content: comment,
      rate: rating,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    db.collection('reviews')
      .add(reviewData)
      .then(() => {
        console.log('Reseña agregada correctamente');
        setRating(0);
        setComment('');
      })
      .catch((error) => {
        console.error('Error al agregar la reseña: ', error);
      });
  };

  return (
    <Paper className={classes.detailsContainer}>
      <Typography variant="h5" gutterBottom>
        {Name}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Precio:</strong> {Precio}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Marca:</strong> {Marca}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Descripción:</strong> {Description}
      </Typography>
      {getImageUrl(listing) && (
        <Box mt={4} className={classes.imageContainer}>
          <img
            src={getImageUrl(listing)}
            alt={Name}
            className={classes.image}
          />
        </Box>
      )}
      <div className={classes.reviewContainer}>
        <Typography variant="h6" gutterBottom>
          Deja tu reseña
        </Typography>
        <div className={classes.reviewForm}>
          <Box className={classes.ratingContainer}>
            <Rating
              value={rating}
              onChange={handleRatingChange}
              precision={0.5}
            />
          </Box>
          <TextField
            className={classes.commentField}
            label="Comentario"
            multiline
            rows={4}
            variant="outlined"
            value={comment}
            onChange={handleCommentChange}
          />
          <Button
            className={classes.submitButton}
            variant="contained"
            color="primary"
            onClick={handleSubmitReview}
            disabled={!rating || !comment}
          >
            Enviar reseña
          </Button>
        </div>
      </div>
    </Paper>
  );
};

export default Details;