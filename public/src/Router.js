import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'; // Asegúrate de importar desde 'react-router-dom' si estás trabajando con React
import cookie from 'cookie';

import AddListing from './containers/AddListing';
import Listings from './containers/Listings';
import Login from './containers/Login';
import Details from './containers/Details';
import About from './components/About';
import HomePage from './components/HomePage';
import UserProfile from './components/UserProfile';

export const checkAuth = () => {
    const cookies = cookie.parse(document.cookie);
    return !!cookies["loggedIn"]; 
};

const ProtectedRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={(props) => checkAuth() ? <Component {...props} /> : <Redirect to="/login" />}
    />
);

const Router = () => (
    <Switch>
        <Route path="/login" component={Login} />
        <Route path="/listings/:id" component={Details} />
        <ProtectedRoute path="/add" component={AddListing} />
        <Route path="/about" component={About} />
        <Route path="/listings" component={Listings} />
        <Route path="/profile" component={UserProfile} />
        <Route path="/" component={HomePage} />
    </Switch>
);

export default Router;