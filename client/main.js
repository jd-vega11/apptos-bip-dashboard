import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";

import './main.html';
//import '../imports/startup/accounts-config.js';
//import App from '../imports/ui/App.js';

import "../imports/ui/assets/css/material-dashboard-react.css";


import indexRoutes from "../imports/ui/routes/index.jsx";

const hist = createBrowserHistory();


// Meteor.startup(() => {
//   render(<App />, document.getElementById('render-target'));
// });

Meteor.startup(() => {
  render(
    <Router history={hist}>
      <Switch>
        {indexRoutes.map((prop, key) => {
          return <Route path={prop.path} component={prop.component} key={key} />;
        })}
      </Switch>
    </Router>, 
    document.getElementById('render-target'));
});