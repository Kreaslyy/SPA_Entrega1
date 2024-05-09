import React from 'react';
import { checkAuth } from '../Router';
import { Container, Grid, Card, CardContent, CardMedia, Typography, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

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
  },
  media: {
    height: 140,
    width: '100%',
    objectFit: 'cover',
  },
  bizName: {
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    textDecoration: 'none',
  },
  deleteIcon: {
    color: theme.palette.error.main,
  },
}));

const Listings = (props) => {
  const classes = useStyles();
  const isAuthenticated = checkAuth();
  const listings = useSelector((state) => state.listings);

  const getImageUrl = (listing) => {
    if (listing.ImageUrl) {
      return listing.ImageUrl;
    } else if (listing.imageUrl) {
      return listing.imageUrl;
    } else {
      return 'https://sibcolombia.net/wp-content/uploads/2020/05/TdeA-1.png';
    }
  };

  return (
    <Container className={classes.container}>
      <Grid container spacing={3}>
        {listings.map((listing, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className={classes.card}>
              <CardMedia
                className={classes.media}
                image={getImageUrl(listing)}
                title={listing['Name']}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  <Link
                    to={`/listings/${encodeURIComponent(listing.Name)}-${encodeURIComponent(listing.Marca)}`}
                    className={classes.bizName}
                  >
                    {listing['Name']}
                  </Link>
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {listing['Description']}
                </Typography>
                <br />
                <Typography variant="body2" color="textSecondary" component="p">
                  Precio: {listing['Precio']}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Marca: {listing['Marca']}
                </Typography>
                {isAuthenticated && (
                  <IconButton
                    aria-label="Delete"
                    onClick={() => props.removeListing(index)}
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