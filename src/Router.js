import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import cookie from 'cookie';
import AddListing from './containers/AddListing';
import Listings from './containers/Listings';
import Login from './containers/Login';
import Details from './containers/Details';
import About from './components/About';
import UserProfile from './components/UserProfile';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCY6-MAcp47p82YWhZUbbdj_clbGvEyz_c",
  authDomain: "product-hunt-97606.firebaseapp.com",
  projectId: "product-hunt-97606",
  storageBucket: "product-hunt-97606.appspot.com",
  messagingSenderId: "999170195451",
  appId: "1:999170195451:web:e24512fb95d9735c8fd55e",
  measurementId: "G-1VDBBTGQHL"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const analytics = firebase.analytics();

export const checkAuth = () => {
  const cookies = cookie.parse(document.cookie);
  return !!cookies["loggedIn"];
};

export const getUserIdFromCookie = () => {
  const cookies = cookie.parse(document.cookie);
  const userData = JSON.parse(cookies["user"] || '{}');
  return userData.uid;
};

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (
      checkAuth() ? (
        <Component {...props} db={db} userId={getUserIdFromCookie()} />
      ) : (
        <Redirect to="/login" />
      )
    )}
  />
);

const Router = () => (
  <Switch>
    <Route path="/login" component={Login} />
    <Route path="/listings/:id" render={(props) => <Details {...props} userId={getUserIdFromCookie()} />} />
    <ProtectedRoute path="/add" component={AddListing} />
    <Route path="/about" component={About} />
    <ProtectedRoute path="/profile" component={UserProfile} />
    <Route path="/" component={Listings} />
  </Switch>
);

export default Router;