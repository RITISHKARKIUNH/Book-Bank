import '../styles/globals.scss';
//all the imports required for font awesome to work
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import '@fortawesome/fontawesome-svg-core/styles.css' // Import the CSS

import '../configureAmplify'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Auth, Hub } from 'aws-amplify'

function MyApp({ Component, pageProps }) {
  const [signedInUser, setSignedInUser] = useState(false);

  useEffect(() => {
    authListener();
  });

  async function authListener() {

    Hub.listen('auth', (data) => {
      switch (data.payload.event) {
        case 'signIn':
          return setSignedInUser(true)
        case 'signOut':
          return setSignedInUser(false)
      }
    });

    try {
      await Auth.currentAuthenticatedUser();
      setSignedInUser(true);
    } catch (err) {
      console.log(err);
    }

  }

  return (
    <Component {...pageProps} />
  )
}

export default MyApp;
