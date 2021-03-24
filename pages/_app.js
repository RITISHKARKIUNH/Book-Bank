import '../styles/globals.scss';
//all the imports required for font awesome to work
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import '@fortawesome/fontawesome-svg-core/styles.css' // Import the CSS

import { Amplify } from "aws-amplify";
import awsExports from "../aws-exports";
Amplify.configure({ ...awsExports, ssr: true });

function MyApp({ Component, pageProps }) {
  return (
    <Component {...pageProps} />
  )
}

export default MyApp;
