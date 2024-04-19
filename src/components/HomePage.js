import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Typography, TextField, Button, makeStyles, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
    textAlign: 'center',
  },
  searchField: {
    marginRight: theme.spacing(2),
  },
}));

const HomePage = ({ history }) => {
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    // Redirige a la página de listados con el término de búsqueda
    history.push(`/listings?search=${searchTerm}`);
  };

  return (
    <div className={classes.container}>
      <Typography variant="h4" gutterBottom>Buscar Productos</Typography>
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
    </div>
  );
};

export default connect(null, null)(HomePage);
