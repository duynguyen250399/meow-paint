import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from '../pages/home';

function RootRoute() {
    return (
        <Router>
            <Route exact path='/' component={Home} />
        </Router>
    )
}

export default RootRoute
