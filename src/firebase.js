/* REACT DEPENDENCIES */
import React from 'react'

/* FIREBASE DEPENDENCIES */
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';

firebase.initializeApp({
  apiKey: "AIzaSyC9UbICNpA767he7W-2PIbuyatG15nwni8",
  authDomain: "bitterr-e8569.firebaseapp.com",
  projectId: "bitterr-e8569",
  storageBucket: "bitterr-e8569.appspot.com",
  messagingSenderId: "120892097413",
  appId: "1:120892097413:web:720206f407c653c9f47aec",
  measurementId: "G-GSBPE4ME1Z"
});

const database = firebase.database()
const auth = firebase.auth()

/* FIREBASE FUNCTIONS */

/*auth.onAuthStateChanged(user => { 
  if (user) {
    // User was successfully signed in
    // Redirect to main page
    window.location.href = "/home"
  }
  else {
    // User is not logged in
    window.location.href = "/signin";
  }
});*/

export function Register() {
    // Get all input fields
    var fname = document.getElementsByClassName('fnameEntry');
    var lname = document.getElementsByClassName('lnameEntry');
    var password = document.getElementsByClassName('passwordEntry');
    var email = document.getElementsByClassName('emailEntry');

    fname = fname[0].value;
    lname = lname[0].value;
    password = password[0].value;
    email = email[0].value;
    alert(fname + lname);
    if (ValidateField(email) == false || ValidateField(fname) == false || ValidateField(lname) == false || ValidatePassword(password) == false) {
      alert(toString(email))
      return
      // Wasn't value, stops continuing the code
    }
    auth.createUserWithEmailAndPassword(email, password)
    .then(function() {
      var user = auth.currentUser;
  
      // Add user profile to Firebase Database
      var databaseRef = database.ref()
  
      // Create user data
      var userData = {
        email: email,
        fname: fname,
        lname: lname,
        lastLogin: Date.now()
      }
      window.location.href = "/signin"
  
      databaseRef.child('users/' + user.uid).set(userData)
    })
    .catch(function(error) {
      var errorCode = error.errorcode
      var errorMessage = error.message
    })
  }
  
export function SignIn() {
    // Get all input fields
    var email = document.getElementsByClassName("emailEntry");
    var password = document.getElementsByClassName("passwordEntry");

    email = email[0].value;
    password = password[0].value;

    auth.signInWithEmailAndPassword(email, password)
    .then(function() {
        var user = auth.currentUser;
        window.location.href = "/home"

        // Update last logged in
        var databaseRef = database.ref()
        var userData = {
          lastLogin: Date.now()
        }
        databaseRef.child('users/' + user.uid).update(userData)
    })
    .catch(function(error) {
      var errorCode = error.code
      var errorMessage = error.message
      alert(errorMessage)
    })
}

export function SignOut() {
  auth.signOut()
  .then(function() {
    window.location.href = "/signin"
  })
}

function ValidatePassword(password) {
    if (password < 6) {
        return false
    } else {
        return true
    }
}
    
function ValidateField(field) {
    if (field == null) {
    return false
    }

    if (field.length <= 0) {
    return false
    } else {
    return true
    }
}