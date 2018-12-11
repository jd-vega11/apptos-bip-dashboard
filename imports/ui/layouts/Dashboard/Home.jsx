/* eslint-disable */
import React from "react";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components

import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";

import dashboardRoutes from "../../routes/dashboard.jsx";

import dashboardStyle from "../../assets/jss/material-dashboard-react/layouts/dashboardStyle.jsx";

//Meteor
import {Meteor} from 'meteor/meteor';


const image = "../../assets/img/sidebar-2.jpg";
const logo = "../../assets/img/reactlogo.png";

const switchRoutes = (
  <Switch>
    {dashboardRoutes.map((prop, key) => {
      if (prop.redirect)
        return <Redirect from={prop.path} to={prop.to} key={key} />;
      return <Route path={prop.path} component={prop.component} key={key} />;
    })}
  </Switch>
);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false
    };
    this.resizeFunction = this.resizeFunction.bind(this);
  }
  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };
  getRoute() {
    return this.props.location.pathname !== "/maps";
  }
  resizeFunction() {
    if (window.innerWidth >= 960) {
      this.setState({ mobileOpen: false });
    }
  }
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      const ps = new PerfectScrollbar(this.refs.mainPanel);
    }
    window.addEventListener("resize", this.resizeFunction);
  }
  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      this.refs.mainPanel.scrollTop = 0;
      if (this.state.mobileOpen) {
        this.setState({ mobileOpen: false });
      }
    }
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeFunction);
  }
  render() {
    const { classes, ...rest } = this.props;
    if(!!Meteor.user()){

      return (
        <div className={classes.wrapper}>
          <Sidebar
            routes={dashboardRoutes}
            logoText={"Creative Tim"}
            logo={logo}
            image={image}
            handleDrawerToggle={this.handleDrawerToggle}
            open={this.state.mobileOpen}
            color="blue"
            {...rest}
          />
          <div className={classes.mainPanel} ref="mainPanel">
            <Header
              routes={dashboardRoutes}
              handleDrawerToggle={this.handleDrawerToggle}
              {...rest}
            />
            {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
            {this.getRoute() ? (
              <div className={classes.content}>
                <div className={classes.container}>{switchRoutes}</div>
              </div>
            ) : (
              <div className={classes.map}>{switchRoutes}</div>
            )}
            {this.getRoute() ? <Footer /> : null}
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div >
            <Header
              routes={dashboardRoutes}
              handleDrawerToggle={this.handleDrawerToggle}
              {...rest}
            />

            <div className="jumbotron">
              <h1>Bip by Apptos</h1>
              <h3 className="textLeft">What is Bip?</h3>
              <p className="textLeft">
                Bip is an application created to facilitate the process of valet parking in Bogotá, Colombia. Its main goal is to 
                provide the customers a safe and easy to use service where they can request a valet to park their car for them. It allows 
                the customers to validate the identity of their valet using QR codes and follow the location of their cars as they move through
                the city. The app is available for iOS and Android.  
              </p>

              <br/>
              <iframe width="560" height="315" src="https://www.youtube.com/embed/sNcvVRepX5s" frameBorder="0" 
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
            <div className="jumbotron">
              <h1>Developers</h1>
              <h3 className="textLeft">
                Bip was developed by Apptos. The members of the team are Bibiana Gamba, Nicolás Acevedo, Juan David Vega and
                Andrés Felipe López.
              </h3>
              <img src="https://serving.photos.photobox.com/0090462457c19e9b0b1b6f7d073353deeb5f7408105f7871c997e3b282b1b04d5a4eac78.jpg" alt="Foto Apptos"/>

            </div>
            <br/>
            <br/>
            <br/>
            <Footer/>
          </div>
        </div>
      );
      
    }
    
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(App);


