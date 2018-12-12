import React, {Component} from 'react';
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "../../components/Grid/GridItem.jsx";
import GridContainer from "../../components/Grid/GridContainer.jsx";
import CustomInput from "../../components/CustomInput/CustomInput.jsx";
import Button from "../../components/CustomButtons/Button.jsx";
import Card from "../../components/Card/Card.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardAvatar from "../../components/Card/CardAvatar.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import CardFooter from "../../components/Card/CardFooter.jsx";

//import avatar from "../../assets/img/faces/marc.jpg";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};


import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth'

class UserProfile extends Component 
{

  constructor(props) {
    super(props);

    this.state = {
    };


    this.createUser = this.createUser.bind(this);
    this.storeUser = this.storeUser.bind(this);
    this.createMultipleRequest = this.createMultipleRequest.bind(this);
    this.createRequest = this.createRequest.bind(this);

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

  createMultipleRequest()
  {
    var i;
    for (i = 0; i < 20; i++) 
    {
      this.createRequest();
    } 
  }

  createRequest( )
  {
    // Add a new document with a generated id.
    const creationTime = Math.floor(Math.random() * (1544631071000 - 1543688411000)) + 1543688411000;
    const base = Math.random();
    const espera =  Math.floor(base * (300000 - 60000)) + 60000;
    const confirmationTime = creationTime + espera;
    const estimatedFare = Math.floor(Math.random() * (27000 - 8000)) + 8000;
    const latitudeClient = Math.random() * (4.700900981824714 - 4.600900981824714) + 4.600900981824714;
    const longitudeClient =  (Math.random() * (74.07764720068894 - 74.06764720068894) + 74.06764720068894)*-1;
    const latitudeValet = Math.random() * (4.700900981824714 - 4.600900981824714) + 4.600900981824714;
    const longitudeValet = (Math.random() * (74.07764720068894 - 74.06764720068894) + 74.06764720068894)*-1;
    const parkLatitude = Math.random() * (4.700900981824714 - 4.600900981824714) + 4.600900981824714;
    const parkLongitude = (Math.random() * (74.07764720068894 - 74.06764720068894) + 74.06764720068894)*-1;


    const valetRating =  Math.floor(base* 6);


    this.db.collection("PickUpServices").add({
        approved: true,
        carParked: true,
        confirmationTime:confirmationTime,
        confirmed: true,
        creationTime: creationTime,
        estimatedFare: estimatedFare,
        idClient:"oVJjOspUVgO8qaX2MYzU5QG8E6q1",
        idValet:"eb1aavHOx6ORJRKqtbvdSbg37uk1",
        latitudeClient:latitudeClient,
        latitudeValet:latitudeValet,
        longitudeClient:longitudeClient,
        longitudeValet:longitudeValet,
        parkLatitude:parkLatitude,
        parkLongitude:parkLongitude,
        plate:"ABC123",
        qr:"kjsafkjlfa",
        validated: true
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });

      this.db.collection("DropOffServices").add({
        approved: true,
        carParked: true,
        confirmationTime:confirmationTime,
        confirmed: true,
        creationTime: creationTime,
        estimatedFare: estimatedFare,
        idClient:"oVJjOspUVgO8qaX2MYzU5QG8E6q1",
        idValet:"eb1aavHOx6ORJRKqtbvdSbg37uk1",
        latitudeClient:latitudeClient,
        latitudeValet:latitudeValet,
        longitudeClient:longitudeClient,
        longitudeValet:longitudeValet,
        parkLatitude:parkLatitude,
        parkLongitude:parkLongitude,
        plate:"ABC123",
        qr:"kjsafkjlfa",
        validated: true,
        valetRating: valetRating
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
     if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }

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
          <button className="btn btn-primary" onClick={() => this.createMultipleRequest()}> Agregar usuario</button>

        </GridItem>
      </GridContainer>
    );
  }
}

export default withStyles(styles)(UserProfile);
