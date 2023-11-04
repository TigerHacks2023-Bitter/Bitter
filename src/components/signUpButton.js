import React from 'react'

/* FIREBASE DEPENDENCIES */
import { Register } from '../firebase'

function signUpClicked () {
    Register()
}

function signUpButton() {
  return (
    <button onClick = {signUpClicked} id = "registerButton" class = "greenButton">Sign Up</button>
  );
}

export default signUpButton