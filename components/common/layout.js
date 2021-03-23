import Head from 'next/head';
import { useRouter } from 'next/router';

import NavBar from './navbar';
import Footer from './footer';

const Layout = ({ children, showSearchBar }) => {
  const router = useRouter();
  let pageName = router.pathname.split("/")[1];

  return (
    <>
      <Head>
        <title>Book Bank!{pageName ? ` | ${pageName}` : ''}</title>
        <link rel="icon" href="/favicon.ico" ></link>
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@100;300;400;500;600;800&display=swap" rel="stylesheet"></link>
      </Head>
      <NavBar pageName={pageName ? pageName : "home"} />
      <main className="section-inner">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
