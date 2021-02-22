import '../styles/globals.scss';
//all the imports required for font awesome to work
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import '@fortawesome/fontawesome-svg-core/styles.css' // Import the CSS

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
