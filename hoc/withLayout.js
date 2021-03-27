import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { API, Auth } from 'aws-amplify';
import { useRouter } from 'next/router';
import NavBar from '../components/common/navbar';
import Footer from '../components/common/footer';
import '../configureAmplify';
import { getUser, booksByUsername } from "../graphql/queries";

export const WithLayout = (WrappedComponent) => {

    const NewComponent = (props) => {
        const router = useRouter();
        let pageName = router.pathname.split("/")[1];
        const [user, setUser] = useState(null);

        useEffect(() => {
            checkUser();
        }, []);

        async function checkUser() {
            try {
                let id = null;
                let userData = null;
                let listedBooks = null;
                let user = await Auth.currentAuthenticatedUser();

                if (user && user.attributes.sub) {
                    id = user.attributes.sub;
                    userData = await API.graphql({
                        query: getUser, variables: { id }
                    });

                    listedBooks = await API.graphql({
                        query: booksByUsername, variables: { username: id }
                    });

                    user = { ...user, profile: userData.data.getUser, listedBooks }
                    setUser(user);
                }

                setUser(user);
                setUserLoading(false);
            } catch (err) {
                setUser(null);
                setUserLoading(false);
            }
        }

        return (
            <>
                <Head>
                    <title>Book Bank!{pageName ? ` | ${pageName}` : ''}</title>
                    <link rel="icon" href="/favicon.ico" ></link>
                    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@100;300;400;500;600;800&display=swap" rel="stylesheet"></link>
                </Head>
                <NavBar pageName={pageName ? pageName : "home"} user={user} />
                <main className="section-inner">
                    <WrappedComponent user={user} {...props} />
                </main>
                <Footer />
            </>
        )
    }

    NewComponent.getInitialProps = async (ctx) => {
        let componentProps = {}
        if (WrappedComponent.getInitialProps) {
            componentProps = await WrappedComponent.getInitialProps(ctx);
        }

        return {
            ...componentProps,
            a: 'b'
        };
    }

    return NewComponent;
}

export default WithLayout;