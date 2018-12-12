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

import regression from 'regression';

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

import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ScatterChart, ZAxis, Scatter } from 'recharts';

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
      genders: [],
      ratings:[],
      waitingTimes:[],
      data01 : [{x: 10, y: 30}, {x: 100, y: 200}],
      data02 : [{x: 30, y: 20}, {x: 50, y: 180}, {x: 75, y: 240}, {x: 100, y: 100}, {x: 120, y: 190}]
    };

  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  calcularRegresion(){
    var data2 = []
    for (var i = 0; i < this.state.ratings.length; i++)
    {
      data2.push([this.state.ratings[i], (this.state.waitingTimes[i]/60000)])
    }

    const result = regression.linear(data2);
    const gradient = result.equation[0];
    const yIntercept = result.equation[1];
    console.log(data2)
    console.log(gradient, yIntercept)
    this.setState({
      data01 : [{x: 0, y: -2.09}, {x: 5, y: -2.09 + 1.52*5}]
    })
    return([0,yIntercept,5, yIntercept + 1.52*5])
  }
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
            me.calcularRegresion()
        });

    this.db.collection("PickUpServices")
        .onSnapshot(function(querySnapshot) {

            var activeServices = 0;
            var clientsWaiting = 0;
            querySnapshot.forEach(function(doc) {
              if(!doc.data().approved)
              {
                activeServices = activeServices + 1;
              }

              if(!doc.data().confirmed)
              {
                clientsWaiting = clientsWaiting + 1;
              }

            });
            me.setState({activeServices:activeServices,clientsWaiting:clientsWaiting})
        });

    this.db.collection("DropOffServices")
        .onSnapshot(function(querySnapshot) {

            var ratings = [];
            var waitingTimes = [];

            querySnapshot.forEach(function(doc) {

              if(doc.data().valetRating !== undefined  && typeof doc.data().confirmationTime == 'number'  && typeof doc.data().creationTime == 'number'
                && doc.data().confirmationTime !== 0 && doc.data().creationTime !== 0)
              {
                ratings.push(doc.data().valetRating);
                waitingTimes.push(Math.round(doc.data().confirmationTime) - Math.round(doc.data().creationTime));
              }


            });
          me.setState({ratings:ratings, waitingTimes:waitingTimes});
          console.log("ratings", ratings);
          console.log("waitingTimes", waitingTimes);


          var data2 = []
          for (var i = 0; i < ratings.length; i++)
          {
            data2.push({x:waitingTimes[i]/60000 , y:ratings[i] })
          }

          me.setState(
            {
              data02: data2
            }
          )

          me.calcularRegresion()

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
            <GridItem xs={12} sm={12} md={6}>
            <Card chart>
              <CardHeader color="info">
                <ScatterChart width={400} height={300} margin={{top: 20, right: 20, bottom: 20, left: 20}}>
                  <XAxis type="number" dataKey={'x'} name='Tiempo de espera' unit='Min'/>
                	<YAxis type="number" dataKey={'y'} name='Calificación' unit=' 😁'/>
                  <ZAxis range={[100]}/>
                	<Tooltip cursor={{strokeDasharray: '3 3'}}/>
                  <Legend/>
                	<Scatter name='Regresión lineal' data={this.state.data01} fill='#8884d8' line/>
                  <Scatter name='Datos' data={this.state.data02} fill='#82ca9d'/>
                </ScatterChart>
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}> Linear regression between rating and waiting time </h4>
                <p className={classes.cardCategory}>
                  y intersept y = -2.09
                </p>
                <p className={classes.cardCategory}>
                  Slope = 1.52
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
