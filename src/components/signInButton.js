import React from 'react'

/* FIREBASE DEPENDENCIES */
import { SignIn } from '../firebase'

function signInClicked() {
    SignIn()
}

function signInButton() {
  return (
    <button onClick = {signInClicked} id = "signInButton" class = "greenButton">Sign In But</button>
  )
}

export default signInButton