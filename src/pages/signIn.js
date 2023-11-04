import React from 'react';

/* INTERACTIVE COMPONENTS */
import SignInButton from '../components/signInButton';
 
const SignIn = () => {
    return (
        <div class = "bodyContent">
          <div class = "signInFrame">
              <h2>Sign In</h2>
              <div class = "fieldFrame">
                  <h4>Email</h4>
                  <input class = "emailEntry" id = "email"/>
              </div>
              <div class = "fieldFrame">
                  <h4>Password</h4>
                  <input class = "passwordEntry" type = "password" id = "password"/>
                  <SignInButton/>
              </div>
              <p>New to Bitterr? <a href = "/signup">Create an account</a></p>
          </div>
        </div>
    );
};
 
export default SignIn;