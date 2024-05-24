import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  makeStyles,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

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
  reviewCard: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
  },
  followButton: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
  },
}));

const Details = (props) => {
  const classes = useStyles();
  const { id } = useParams();
  const listings = useSelector((state) => state.listings);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [creatorUserId, setCreatorUserId] = useState(null);

  const [name, marca] = id.split('-');
  const listing = listings.find((l) => l.Name === name && l.Marca === marca);

  useEffect(() => {
    const fetchReviews = async () => {
      const db = firebase.firestore();
      const querySnapshot = await db
        .collection('reviews')
        .where('productId', '==', `${name}${marca}`)
        .get();

      const reviewsData = querySnapshot.docs.map((doc) => doc.data());
      setReviews(reviewsData);
    };

    fetchReviews();
  }, [name, marca]);

  useEffect(() => {
    if (listing) {
      setCreatorUserId(listing.userId);
    }
  }, [listing]);

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
    const userId = props.userId;

    if (!userId) {
      console.error('No se proporcionó el userId');
      return;
    }

    const reviewData = {
      productId: `${Name}${Marca}`,
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
        fetchReviews(); // Actualizar las reseñas después de agregar una nueva
      })
      .catch((error) => {
        console.error('Error al agregar la reseña: ', error);
      });
  };

  const fetchReviews = async () => {
    const db = firebase.firestore();
    const querySnapshot = await db
      .collection('reviews')
      .where('productId', '==', `${Name}${Marca}`)
      .get();

    const reviewsData = querySnapshot.docs.map((doc) => doc.data());
    setReviews(reviewsData);
  };

  const handleFollow = () => {
    const db = firebase.firestore();
    const currentUserId = props.userId;
    const creatorUserId = listing.userId;

    // Agregar el usuario actual como seguidor del creador del producto
    db.collection('followers')
      .doc(creatorUserId)
      .collection('userFollowers')
      .doc(currentUserId)
      .set({})
      .catch((error) => {
        console.error('Error al agregar seguidor: ', error);
      });

    // Agregar el creador del producto a la lista de seguidos del usuario actual
    db.collection('followings')
      .doc(currentUserId)
      .collection('userFollowings')
      .doc(creatorUserId)
      .set({})
      .catch((error) => {
        console.error('Error al agregar seguido: ', error);
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
          <img src={getImageUrl(listing)} alt={Name} className={classes.image} />
        </Box>
      )}
      <div className={classes.followButton}>
        <IconButton onClick={handleFollow} disabled={!creatorUserId || creatorUserId === props.userId}>
          <PersonAddIcon />
        </IconButton>
        <Typography variant="body1">Seguir al creador del producto</Typography>
      </div>
      {props.userId ? (
        <div className={classes.reviewContainer}>
          <Typography variant="h6" gutterBottom>
            Deja tu reseña
          </Typography>
          <div className={classes.reviewForm}>
            <Box className={classes.ratingContainer}>
              <Rating value={rating} onChange={handleRatingChange} precision={0.5} />
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
      ) : (
        <Typography variant="body1">
          Debes iniciar sesión para dejar una reseña.
        </Typography>
      )}
      <Typography variant="h6" gutterBottom>
        Reseñas
      </Typography>
      {reviews.map((review, index) => (
        <Card key={index} className={classes.reviewCard}>
          <CardContent>
            <Typography variant="body1" gutterBottom>
              <strong>Calificación:</strong> {review.rate}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Comentario:</strong> {review.content}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Paper>
  );
};

export default Details;