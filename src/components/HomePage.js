import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, TextField, Button, makeStyles, Grid, Card, CardMedia, CardContent } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
    textAlign: 'center',
  },
  searchField: {
    marginRight: theme.spacing(2),
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
      <Typography variant="h4" gutterBottom>
        Buscar Productos
      </Typography>
      <Grid container justify="center" alignItems="center">
        <Grid item xs={12} sm={8} md={6} className={classes.searchField}>
          <TextField
            label="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            fullWidth
          >
            Buscar
          </Button>
        </Grid>
      </Grid>
      {filteredProducts.length > 0 && (
        <Grid container spacing={3} style={{ marginTop: '2rem' }}>
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
                  <Typography gutterBottom variant="h5" component="div">
                    {product.Name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.Description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default HomePage;