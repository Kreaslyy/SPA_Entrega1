import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, TextField, Button, makeStyles, Grid, Card, CardMedia, CardContent, Container } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
  },
  searchField: {
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(4),
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
  title: {
    fontWeight: 'bold',
    color: '#3f51b5',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    '&:hover': {
      color: '#283593',
    },
  },
  description: {
    marginBottom: theme.spacing(2),
  },
  searchContainer: {
    backgroundColor: '#ffffff',
    padding: theme.spacing(4),
    borderRadius: theme.spacing(1),
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: 600,
    margin: '0 auto',
  },
  searchButton: {
    backgroundColor: 'transparent',
    border: '2px solid #3f51b5',
    color: '#3f51b5',
    fontWeight: 'bold',
    padding: theme.spacing(1, 3),
    borderRadius: theme.spacing(1),
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#3f51b5',
      color: '#ffffff',
    },
  },
  searchTitle: {
    fontWeight: 700,
  },
}));

const HomePage = () => {
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  const dispatch = useDispatch();
  const products = useSelector((state) => state.listings);

  const handleSearch = () => {
    const filtered = products.filter((product) =>
      product.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className={classes.container}>
      <Container maxWidth="md">
        <div className={classes.searchContainer}>
          <Typography variant="h4" gutterBottom className={classes.searchTitle}>
            Buscar Productos
          </Typography>
          <Grid container justify="center" alignItems="center" spacing={2}>
            <Grid item xs={12} sm={8} className={classes.searchField}>
              <TextField
                label="Buscar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                className={classes.searchButton}
                onClick={handleSearch}
                fullWidth
              >
                Buscar
              </Button>
            </Grid>
          </Grid>
        </div>
      </Container>
      {filteredProducts.length > 0 && (
        <Container maxWidth="md" style={{ marginTop: '2rem' }}>
          <Grid container spacing={3}>
            {filteredProducts.map((product, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.media}
                    component="img"
                    alt={product.Name}
                    image={product.ImageUrl || 'https://sibcolombia.net/wp-content/uploads/2020/05/TdeA-1.png'}
                    title={product.Name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" className={classes.title}>
                      {product.Name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className={classes.description}>
                      {product.Description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}
    </div>
  );
};

export default HomePage;