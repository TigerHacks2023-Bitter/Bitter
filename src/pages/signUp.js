import React from 'react';

/* INTERACTIVE COMPONENTS */
import SignUpButton from '../components/signUpButton'

const SignUp = () => {
    return (
        <div class = "bodyContent">
          <div class = "signUpFrame">
              <h2>Create an account</h2>
              <div id = "fname" class = "fieldFrame">
                <h4>First name</h4>
                <input class = "fnameEntry" id = "fname"/>
              </div>
              <div id = "lname" class = "fieldFrame">
                <h4>Last name</h4>
                <input class = "lnameEntry" id = "lnameEntry"/>
              </div>
              <div id = "email" class = "fieldFrame">
                  <h4>Email</h4>
                  <input class = "emailEntry" id = "email"/>
              </div>
              <div id = "password" class = "fieldFrame">
                  <h4>Password</h4>
                  <input type = "password" class = "passwordEntry" id = "password"/>
              </div>
              <SignUpButton/>
              <p>Already have an account? <a href = "/signin">Sign in</a></p>
          </div>
        </div>
    );
};
 
export default SignUp;