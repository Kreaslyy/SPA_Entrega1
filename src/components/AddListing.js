import React, { useState } from "react";
import { Button, TextField, Box, makeStyles } from "@material-ui/core";

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
}));

const AddListing = (props) => {
  const classes = useStyles();

  const [listing, setListing] = useState({
    Name: '',
    Address: '',
    Hours: '',
    Description: ''
  });

  const handleTextChange = (e) => {
    const newListing = { ...listing };
    newListing[e.target.id] = e.target.value;
    setListing(newListing);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...listing };
    payload.id = props.listings.length + 1;
    props.addListing(payload);
    setListing({
      Name: '',
      Address: '',
      Hours: '',
      Description: ''
    });
  }

  return (
    <div className={classes.container}>
      <Box className={classes.formContainer}>
        <form className={classes.form} onSubmit={handleSubmit} action="/listings">
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
