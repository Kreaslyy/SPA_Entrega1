import React from 'react';
import {
  Typography,
  Box,
  Paper,
  makeStyles
} from '@material-ui/core';

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
}));

const Details = (props) => {
  const classes = useStyles();
  const id = props.match.params.id;
  const listing = props.listings.find(l => l.id == id);
  
  if (!listing) {
    return <div>No se encontró el listado con el ID proporcionado.</div>;
  }

  const { Name, Address, Hours, Description, imageUrl, Precio, Marca } = listing;

  return (
    <Paper className={classes.detailsContainer}>
      <Typography variant="h5" gutterBottom>{Name}</Typography>
      <Typography variant="body1" gutterBottom><strong>Precio:</strong> {Precio}</Typography>
      <Typography variant="body1" gutterBottom><strong>Marca:</strong> {Marca}</Typography>
      <Typography variant="body1" gutterBottom><strong>Descripción:</strong> {Description}</Typography>
      {imageUrl && (
        <Box mt={4} className={classes.imageContainer}>
          <img src={imageUrl} alt={Name} className={classes.image} />
        </Box>
      )}
    </Paper>
  );
};

export default Details;
