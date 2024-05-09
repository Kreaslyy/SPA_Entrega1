import React, { useState } from "react";
import { TextField } from '@material-ui/core';
import { Button } from "@material-ui/core";
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useHistory } from 'react-router-dom';

const Login = (props) => {
  const provider = new GoogleAuthProvider();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleCreateUser = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('user', user);
        // Aquí puedes establecer la cookie "loggedIn" después de crear el usuario
        document.cookie = "loggedIn=true";
        history.push('/listing');
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === "auth/email-already-in-use") {
          alert("El usuario ya está registrado");
        } else {
          alert(errorCode);
        }
      });
  }

  const handleLoginEmail = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('user', user);
        // Aquí puedes establecer la cookie "loggedIn" después de iniciar sesión
        document.cookie = "loggedIn=true";
        history.push('/listing');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`Error ${errorCode} - ${errorMessage}`);
      });
  }

  const handleGoogle = () => {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log(user);
        // Aquí puedes establecer la cookie "loggedIn" después de iniciar sesión con Google
        document.cookie = "loggedIn=true";
        history.push('/listing');
      })
      .catch((error) => {
        const errorMessage = error.message;
        const email = error.customData.email;
        console.log(`Error ${email} - ${errorMessage}`);
      });
  }

  return (
    <form className="login-form">
      <TextField
        required="true"
        placeholder="Username"
        label="Username"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <TextField
        required="true"
        placeholder="Password"
        type="password"
        label="Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <div className="margin-top-sm button-wide">
        <Button
          fullWidth={true}
          variant="contained"
          className="login-button"
          onClick={() => {
            handleCreateUser();
          }}
        >
          Crear usuario
        </Button>
        <Button
          fullWidth={true}
          variant="contained"
          className="login-button"
          onClick={() => {
            handleLoginEmail();
          }}
        >
          Login
        </Button>
        <Button
          fullWidth={true}
          variant="contained"
          className="login-button"
          onClick={() => {
            handleGoogle();
          }}
        >
          Google
        </Button>
      </div>
    </form>
  );
}

export default Login;