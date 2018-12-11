import React, {Component} from 'react';
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Hidden from "@material-ui/core/Hidden";
// core components
import GridItem from "../../components/Grid/GridItem.jsx";
import GridContainer from "../../components/Grid/GridContainer.jsx";
import Card from "../../components/Card/Card.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardBody from "../../components/Card/CardBody.jsx";

import iconsStyle from "../../assets/jss/material-dashboard-react/views/iconsStyle.jsx";

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth'

class Icons extends Component 
{

  constructor(props) {
    super(props);

    this.state = {
    };


    this.createUser = this.createUser.bind(this);
    this.storeUser = this.storeUser.bind(this);

  }

  createUser(i)
  {

    if(i > 200) return;


    const email="test"+i+"@client.com";
    const password="123456";

    const me = this;
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function(userRef){

      console.log("userRef", userRef);

      const user = firebase.auth().currentUser;
      me.storeUser(email, user.uid, i);

    })
    .catch(function(error) {
      console.log("error creating user", error);
      console.log("error message", error.message);
      console.log("error code", error.code);
    });    

  }

  storeUser(email, id, i)
  {
    const me = this;
    const womanNames = ["Ana", "Maria", "Beatriz", "Sandra", "Rosa"];
    const manNames = ["Mario", "Pedro", "Esteban", "Felipe", "Jose"];
    const lastNames = ["Perez", "Ramirez", "Hernandez", "Linares", "Navas", "Laserna", "Laverde", "Rodriguez"];
    const genderN = Math.random();

    var gender = "Male";
    var name = manNames[Math.floor(Math.random() * 5)];
    if(genderN >= 0.5){

     gender = "Female";
     name=womanNames[Math.floor(Math.random() * 5)];

    }

    const lastName = lastNames[Math.floor(Math.random() * 8)];

    this.db.collection("Users").doc(id).set({
        age:  Math.floor(Math.random() * (50 - 19)) + 19,
        client: true,
        email: email,
        gender: gender,
        lastName: lastName,
        name: name,
        phone: "3101171825"
    })
    .then(function() {
        console.log("Document successfully written!");
        firebase.auth().signOut().then(function() {

          console.log("successfully signed out");

          i = i+1;

          me.createUser(i);


        }).catch(function(error) {

          console.log("error with sign out", error);
          
        });
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });

  }

  createRequest( )
  {
    // Add a new document with a generated id.
    this.db.collection("PickUpServices").add({
        approved: true,
        carParked: true,
        confirmationTime:0,
        confirmed: true,
        creationTime: 0,
        estimatedFare: 0,
        idClient:"id",
        idValet:"id",
        latitudeClient:0,
        latitudeValet:0,
        longitudeClient:0,
        longitudeValet:0,
        parkLatitude:0,
        parkLongitude:0,
        plate:"HLO",
        qr:"kjsafkjlfa",
        validated: true,
        valetRating:0
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
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
    firebase.initializeApp(config);

    this.db = firebase.firestore();
/*
    // Initialize Cloud Firestore through Firebase
   

    // Disable deprecated features
    db.settings({
      timestampsInSnapshots: true
    });*/
  }

  render() {
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <button className="btn btn-primary" onClick={() => this.createUser(2)}> Agregar usuario</button>

        </GridItem>
      </GridContainer>
    );
  }
}

Icons.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(iconsStyle)(Icons);
