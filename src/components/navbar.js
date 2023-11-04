import React from 'react'
import LogOutButton from './signOutButton'

function navbar() {
  return (
    <div class = "navigationBar">
        <img class = "navLogo" src = "images/appLogo.svg"/>
        <h3>Bitterr</h3>
        <LogOutButton/>
    </div>
  )
}

export default navbar