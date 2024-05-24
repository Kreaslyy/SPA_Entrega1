// Navigation.js
import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link, useHistory } from "react-router-dom";
import { checkAuth } from "../Router";
import cookie from "cookie";

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "#ffffff",
    color: "#000000",
  },
  title: {
    flexGrow: 1,
  },
  link: {
    color: "#000000",
    marginLeft: theme.spacing(2),
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

const Navigation = () => {
  const classes = useStyles();
  const history = useHistory();
  const [user, setUser] = useState({});

  useEffect(() => {
    const cookies = cookie.parse(document.cookie);
    setUser(JSON.parse(cookies["user"] || "{}"));
  }, []);

  const handleLogout = () => {
    document.cookie = "loggedIn=";
    document.cookie = "user=";
    history.push("/login");
    window.location.reload();
  };

  return (
    <>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            TdeA Shop
          </Typography>
          {checkAuth() ? (
            <>
              <Link to="/" className={classes.link}>
                Products
              </Link>
              <Link to="/add" className={classes.link}>
                Add Product
              </Link>
              <Link to="/profile" className={classes.link}>
                Profile
              </Link>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className={classes.link}>
                Login
              </Link>
              <Link to="/about" className={classes.link}>
                About
              </Link>
            </>
          )}
        </Toolbar>
      </AppBar>
      {user?.displayName && (
        <Typography variant="subtitle1" align="right" style={{ marginRight: 16 }}>
          Logged in as: {user.displayName}
        </Typography>
      )}
    </>
  );
};

export default Navigation;