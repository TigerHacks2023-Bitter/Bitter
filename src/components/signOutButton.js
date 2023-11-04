import React from 'react'

/* FIREBASE DEPENDENCIES */
import { SignOut } from '../firebase'

function signOut() {
    SignOut()
}

function signOutButton() {
  return (
    <a href = "" onClick = {signOut} class = "logOutButton">Log out</a>
  )
}

export default signOutButton