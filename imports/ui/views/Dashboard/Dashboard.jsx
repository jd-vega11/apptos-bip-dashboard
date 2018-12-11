import React from "react";
import PropTypes from "prop-types";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
// core components
import GridItem from "../../components/Grid/GridItem.jsx";
import GridContainer from "../../components/Grid/GridContainer.jsx";
import Table from "../../components/Table/Table.jsx";
import Tasks from "../../components/Tasks/Tasks.jsx";
import CustomTabs from "../../components/CustomTabs/CustomTabs.jsx";
import Danger from "../../components/Typography/Danger.jsx";
import Card from "../../components/Card/Card.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardIcon from "../../components/Card/CardIcon.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";

import { bugs, website, server } from "../../variables/general.jsx";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart,
  hours,
  faresByHour,
  waitingTimes,
  rankingValets,
  averageAge
} from "../../variables/charts.jsx";

import dashboardStyle from "../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';

class Dashboard extends React.Component {

  constructor(props) {
    super(props);

  
    this.state = {
      value:0,
      clients:[],
      valets:[],
      activeServices:0,
      clientsWaiting:0,
      averageAge: averageAge.data,
      genders: []
    };

  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  componentDidMount()
  {
    var config = {
      apiKey: "AIzaSyCcceQjxBOA2-oG4CJzzDADBaVajmfq_1g",
      authDomain: "bipapp-mobile-dev.firebaseapp.com",
      databaseURL: "https://bipapp-mobile-dev.firebaseio.com",
      projectId: "bipapp-mobile-dev",
      storageBucket: "bipapp-mobile-dev.appspot.com",
      messagingSenderId: "138636836135"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
   

    this.db = firebase.firestore();

    const me = this;

    this.db.collection("Users")
        .onSnapshot(function(querySnapshot) {
            var clients = [];
            var valets = [];

            var averageAgeValet = 0;
            var averageAgeClient = 0;

            var valetMale = 0;
            var valetFemale = 0;

            var clientMale = 0;
            var clientFemale = 0;

            querySnapshot.forEach(function(doc) {
                if(doc.data().client)
                {
                  clients.push(doc);
                  if(doc.data().age !== undefined && typeof doc.data().age == 'number')
                  {
                    averageAgeClient = averageAgeClient + doc.data().age;
                  }

                  if(doc.data().gender !== undefined)
                  {
                    if(doc.data().gender === "Male") 
                    {
                      clientMale = clientMale + 1;
                    }
                    else
                    {
                      clientFemale = clientFemale + 1;
                    }
                  }
                  
                }
                else
                {
                  valets.push(doc);
                  if(doc.data().age != undefined && typeof doc.data().age == 'number')
                  {
                    averageAgeValet = averageAgeValet + doc.data().age;
                  }

                  if(doc.data().gender !== undefined)
                  {
                    if(doc.data().gender === "Male") 
                    {
                      valetMale = valetMale + 1;
                    }
                    else
                    {
                      valetFemale = valetFemale + 1;
                    }
                  }                  
                }
            });

            //Average ages

            var data = me.state.averageAge;
            console.log("data", data);
            console.log("averageAgeClient", averageAgeClient);
            console.log("averageAgeValet", averageAgeValet);

            if(clients.length > 0 && valets.length > 0)
            {
              averageAgeClient = averageAgeClient/clients.length;
              averageAgeValet = averageAgeValet/valets.length;
              data = {
                labels: [
                  "Valets",
                  "Clients"
                ],
                series: [[averageAgeValet, averageAgeClient]]
              };
            } 

            //Genders

            var genders = [
              {name: 'Valets', Male: valetMale, Female: valetFemale},
              {name: 'Clients', Male: clientMale, Female: clientFemale}
            ];

            me.setState({clients: clients, valets:valets, averageAge:data, genders: genders});
            
            
        });

    this.db.collection("PickUpServices")
        .onSnapshot(function(snapshot) {

            var activeServices = me.state.activeServices;
            var clientsWaiting = me.state.clientsWaiting;
            snapshot.docChanges().forEach(function(change) {
                if (change.type === "added") {

                    if(!change.doc.data().approved)
                    {
                      activeServices = activeServices + 1;
                    }

                    if(!change.doc.data().confirmed)
                    {
                      clientsWaiting = clientsWaiting + 1;
                    }
                    console.log("New req: ", change.doc.data());
                }
                if (change.type === "modified") {

                    if(change.doc.data().approved)
                    {
                      activeServices = activeServices - 1;
                    }

                    if(change.doc.data().confirmed)
                    {
                      clientsWaiting = clientsWaiting - 1;
                    }
                    console.log("New req: ", change.doc.data());

                    console.log("Modified req: ", change.doc.data());
                }
                if (change.type === "removed") {
                    if(!change.doc.data().confirmed)
                    {
                      clientsWaiting = clientsWaiting - 1;
                    }

                    if(!change.doc.data().approved)
                    {
                      activeServices = activeServices - 1;
                    }
                    console.log("Removed req: ", change.doc.data());
                }
            });

            me.setState({activeServices:activeServices,clientsWaiting:clientsWaiting})
        });
  /*
    // Initialize Cloud Firestore through Firebase
   

    // Disable deprecated features
    db.settings({
      timestampsInSnapshots: true
    });*/
  }

  componentWillUnmount()
  {
    if(this.db)
    {
      var unsubscribeUsers = this.db.collection("Users")
          .onSnapshot(function () {});
      // ...
      // Stop listening to changes
      unsubscribeUsers();

      var unsubscribePickUpServices = this.db.collection("PickUpServices")
          .onSnapshot(function () {});
      // ...
      // Stop listening to changes
      unsubscribePickUpServices();
    }
    

  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="warning" stats icon>
                <CardIcon color="warning">
                  <Accessibility />
                </CardIcon>
                <p className={classes.cardCategory}>Clients</p>
                <h3 className={classes.cardTitle}>
                  {this.state.clients.length} 
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <Update />
                  Just Updated
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="info" stats icon>
                <CardIcon color="info">
                  <Icon>contact_mail</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Valets</p>
                <h3 className={classes.cardTitle}>{this.state.valets.length}</h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <Update />
                  Just Updated
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="success" stats icon>
                <CardIcon color="success">
                  <Icon>arrow_upward</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Active Services</p>
                <h3 className={classes.cardTitle}>{this.state.activeServices}</h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <Update />
                  Just Updated
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="danger" stats icon>
                <CardIcon color="danger">
                  <Icon>schedule</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Clients waiting</p>
                <h3 className={classes.cardTitle}>{this.state.clientsWaiting}</h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <Update />
                  Just Updated
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card chart>
              <CardHeader color="success">
                <ChartistGraph
                  className="ct-chart"
                  data={hours.data}
                  type="Bar"
                  options={hours.options}
                  responsiveOptions={hours.responsiveOptions}
                  listener={hours.animation}
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Requests by day hours</h4>
                <p className={classes.cardCategory}>                  
                  Last Month
                </p>
              </CardBody>
              <CardFooter chart>
                <div className={classes.stats}>
                  <AccessTime /> made with historical information
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            <Card chart>
              <CardHeader color="success">
                <ChartistGraph
                  className="ct-chart"
                  data={faresByHour.data}
                  type="Bar"
                  options={faresByHour.options}
                  responsiveOptions={faresByHour.responsiveOptions}
                  listener={faresByHour.animation}
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>(COP) Average service cost by hour</h4>
                <p className={classes.cardCategory}>
                  Last Month Aggregate
                </p>
              </CardBody>
              <CardFooter chart>
                <div className={classes.stats}>
                  <AccessTime /> made with historical information
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            <Card chart>
              <CardHeader color="warning">
                <ChartistGraph
                  className="ct-chart"
                  data={waitingTimes.data}
                  type="Line"
                  options={waitingTimes.options}
                  listener={waitingTimes.animation}
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Average waiting times (min) by day hours</h4>
                <p className={classes.cardCategory}>
                  Last Month
                </p>
              </CardBody>
              <CardFooter chart>
                <div className={classes.stats}>
                  <AccessTime /> made with historical information
                </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
        <GridContainer>          
          <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color="info">
                <h4 className={classes.cardTitleWhite}>Valet Stats</h4>
                <p className={classes.cardCategoryWhite}>
                  Best Valets by costumers rating (last month)
                </p>
              </CardHeader>
              <CardBody>
                <Table
                  tableHeaderColor="warning"
                  tableHead={["Position", "Name", "Average Rating"]}
                  tableData={rankingValets}
                />
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <Card chart>
              <CardHeader color="info">
                <ChartistGraph
                  className="ct-chart"
                  data={this.state.averageAge}
                  type="Bar"
                  options={averageAge.options}
                  responsiveOptions={averageAge.responsiveOptions}
                  listener={averageAge.animation}
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Average age</h4>
                <p className={classes.cardCategory}>
                  Udated in the last 5 minutes
                </p>
              </CardBody>
              <CardFooter chart>
                <div className={classes.stats}>
                  <AccessTime /> made with historical information
                </div>
              </CardFooter>
            </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={6}>
            <Card chart>
              <CardHeader color="info">
                <BarChart width={350} height={211} data={this.state.genders}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Male" fill="#8884d8" />
                  <Bar dataKey="Female" fill="#82ca9d" />
                </BarChart>
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Gender distribution</h4>
                <p className={classes.cardCategory}>
                  Udated in the last 5 minutes
                </p>
              </CardBody>
              <CardFooter chart>
                <div className={classes.stats}>
                  <AccessTime /> made with historical information
                </div>
              </CardFooter>
            </Card>
            </GridItem>
        </GridContainer>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
