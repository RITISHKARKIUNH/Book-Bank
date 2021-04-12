import '../styles/globals.scss';
//all the imports required for font awesome to work
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import '@fortawesome/fontawesome-svg-core/styles.css' // Import the CSS
import 'react-toastify/dist/ReactToastify.css';

import { Amplify } from "aws-amplify";
import { ToastContainer } from 'react-toastify';
import awsExports from "../aws-exports";
Amplify.configure({ ...awsExports, ssr: true });

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer />
    </>
  )
}

export default MyApp;
