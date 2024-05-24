// Login.js
import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    width: "100%",
    maxWidth: 400,
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

const Login = () => {
  const classes = useStyles();
  const provider = new GoogleAuthProvider();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleCreateUser = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        document.cookie = "loggedIn=true";
        document.cookie = `user=${JSON.stringify(user)}`;
        history.push("/listing");
        window.location.reload();
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === "auth/email-already-in-use") {
          alert("El usuario ya está registrado");
        } else {
          alert(errorCode);
        }
      });
  };

  const handleLoginEmail = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("user", user);
        document.cookie = "loggedIn=true";
        document.cookie = `user=${JSON.stringify(user)}`;
        history.push("/listing");
        window.location.reload();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`Error ${errorCode} - ${errorMessage}`);
      });
  };

  const handleGoogle = () => {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log(user);
        document.cookie = "loggedIn=true";
        document.cookie = `user=${JSON.stringify(user)}`;
        history.push("/listing");
        window.location.reload();
      })
      .catch((error) => {
        const errorMessage = error.message;
        const email = error.customData.email;
        console.log(`Error ${email} - ${errorMessage}`);
      });
  };

  return (
    <Container className={classes.container}>
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      <form className={classes.form}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleLoginEmail}
          className={classes.button}
        >
          Login
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleCreateUser}
          className={classes.button}
        >
          Create User
        </Button>
        <Box mt={2}>
          <Button variant="outlined" onClick={handleGoogle}>
            Sign in with Google
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default Login;