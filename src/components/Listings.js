import React from 'react';
import { checkAuth } from '../Router';
import { Container, Grid, Card, CardContent, CardMedia, Typography, IconButton, makeStyles } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
  },
  card: {
    maxWidth: 345,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    borderRadius: theme.spacing(1),
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      transform: 'translateY(-2px)',
    },
  },
  media: {
    height: 200,
    width: '100%',
    objectFit: 'cover',
  },
  bizName: {
    fontWeight: 'bold',
    color: '#3f51b5',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    '&:hover': {
      color: '#283593',
    },
  },
  deleteIcon: {
    color: '#e53935',
    transition: 'all 0.3s ease',
    '&:hover': {
      color: '#c62828',
    },
  },
  description: {
    marginBottom: theme.spacing(2),
  },
}));

const Listings = (props) => {
  const classes = useStyles();
  const isAuthenticated = checkAuth();
  const listings = useSelector((state) => state.listings);
  const userId = props.userId;
  const dispatch = useDispatch();

  const getImageUrl = (listing) => {
    if (listing.ImageUrl) {
      return listing.ImageUrl;
    } else if (listing.imageUrl) {
      return listing.imageUrl;
    } else {
      return 'https://sibcolombia.net/wp-content/uploads/2020/05/TdeA-1.png';
    }
  };

  const handleDeleteListing = (listing) => {
    if (userId === listing.userId) {
      const db = firebase.firestore();

      db.collection('productos')
        .doc(listing.id)
        .delete()
        .then(() => {
          console.log('Producto eliminado correctamente');
          dispatch({ type: 'REMOVE_LISTING', payload: listing });
        })
        .catch((error) => {
          console.error('Error al eliminar el producto: ', error);
        });
    } else {
      console.log('No tienes permiso para eliminar este producto');
    }
  };

  return (
    <Container className={classes.container}>
      <Grid container spacing={3}>
        {listings.map((listing, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className={classes.card}>
              <CardMedia className={classes.media} image={getImageUrl(listing)} title={listing['Name']} />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  <Link
                    to={`/listings/${encodeURIComponent(listing.Name)}-${encodeURIComponent(listing.Marca)}`}
                    className={classes.bizName}
                  >
                    {listing['Name']}
                  </Link>
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p" className={classes.description}>
                  {listing['Description']}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Precio: {listing['Precio']}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Marca: {listing['Marca']}
                </Typography>
                {isAuthenticated && userId === listing.userId && (
                  <IconButton
                    aria-label="Delete"
                    onClick={() => handleDeleteListing(listing)}
                    className={classes.deleteIcon}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Listings;