import React from 'react';
import { Route, Redirect } from 'react-router-dom';


const PublicRoute = ({isLogged: IsLogged, component: Component, restricted, ...rest}) => {
    return (
        // restricted = false meaning public route
        // restricted = true meaning restricted route
        <Route {...rest} render={props => (
            IsLogged ?
                <Redirect to="/login" />
            : <Component {...props} />
        )} />
    );
};

export default PublicRoute;