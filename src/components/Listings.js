import React, { useState } from 'react';
import { checkAuth } from '../Router';
import { Container, IconButton, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Grid, Card, CardMedia, CardContent, CardActions } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(2),
  },
  filterContainer: {
    marginBottom: theme.spacing(2),
  },
  filterField: {
    marginRight: theme.spacing(2),
    minWidth: 120,
  },
  productCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  productMedia: {
    paddingTop: '56.25%', // 16:9
  },
  productContent: {
    flexGrow: 1,
  },
  productActions: {
    justifyContent: 'flex-end',
  },
}));

const Listings = (props) => {
  const classes = useStyles();
  const isAuthenticated = checkAuth();
  const listings = useSelector((state) => state.listings);
  const userId = props.userId;
  const [filterName, setFilterName] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterTags, setFilterTags] = useState('');
  const [filterRating, setFilterRating] = useState(0);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'filterName':
        setFilterName(value);
        break;
      case 'filterCategory':
        setFilterCategory(value);
        break;
      case 'filterTags':
        setFilterTags(value);
        break;
      case 'filterRating':
        setFilterRating(value);
        break;
      default:
        break;
    }
  };

  const filteredListings = listings.filter((listing) => {
    const matchName = listing.Name.toLowerCase().includes(filterName.toLowerCase());
    const matchCategory = filterCategory === '' || listing.Categoria === filterCategory;
    const matchTags = filterTags === '' || listing.Tags.some((tag) => tag.toLowerCase().includes(filterTags.toLowerCase()));
    const matchRating = filterRating === 0 || (listing.Rate && listing.Rate >= filterRating);
    return matchName && matchCategory && matchTags && matchRating;
  });

  const getImageUrl = (listing) => {
    if (listing.ImageUrl) {
      return listing.ImageUrl;
    } else if (listing.imageUrl) {
      return listing.imageUrl;
    } else {
      return 'https://via.placeholder.com/300x200';
    }
  };

  const categories = [...new Set(listings.map((listing) => listing.Categoria))];

  const averageRating = listings.reduce((sum, listing) => sum + (listing.Rate || 0), 0) / listings.length;

  return (
    <Container className={classes.container}>
      <div className={classes.filterContainer}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Nombre"
              name="filterName"
              value={filterName}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                name="filterCategory"
                value={filterCategory}
                onChange={handleFilterChange}
              >
                <MenuItem value="">Todas</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Etiquetas"
              name="filterTags"
              value={filterTags}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Calificación</InputLabel>
              <Select
                name="filterRating"
                value={filterRating}
                onChange={handleFilterChange}
              >
                <MenuItem value={0}>Todas</MenuItem>
                <MenuItem value={1}>1+</MenuItem>
                <MenuItem value={2}>2+</MenuItem>
                <MenuItem value={3}>3+</MenuItem>
                <MenuItem value={4}>4+</MenuItem>
                <MenuItem value={5}>5</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </div>
      <Grid container spacing={2}>
        {filteredListings.map((listing, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className={classes.productCard}>
              <CardMedia
                className={classes.productMedia}
                image={getImageUrl(listing)}
                title={listing['Name']}
              />
              <CardContent className={classes.productContent}>
                <Typography gutterBottom variant="h6" component="h2">
                  <Link to={`/listings/${encodeURIComponent(listing.Name)}-${encodeURIComponent(listing.Marca)}`}>
                    {listing['Name']}
                  </Link>
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {listing['Description']}
                </Typography>
                <Typography variant="subtitle1">Precio: {listing['Precio']}</Typography>
                <Typography variant="subtitle2">Marca: {listing['Marca']}</Typography>
              </CardContent>
              {isAuthenticated && userId === listing.userId && (
                <CardActions className={classes.productActions}>
                  <IconButton
                    aria-label="Delete"
                    onClick={() => props.removeListing(index)}
                    color="secondary"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
      <Typography variant="h6" align="center" style={{ marginTop: '16px' }}>
        Promedio global de calificaciones: {averageRating.toFixed(2)}
      </Typography>
    </Container>
  );
};

export default Listings;