import { withSSRContext } from 'aws-amplify';

export default function withUser({ autheticated, user }) {
    if (!autheticated) {
        return <h1> Not autheicated </h1>
    }
    return <h1> Autheticated </h1>
}

export async function getServerSideProps({ req, res }) {
    const { Auth } = withSSRContext({ req });
    const user = await Auth.currentAuthenticatedUser();

    if(!user){
        res.writeHead(307, {Location: '/login'});
        res.end();
        return {props: {}};
    }

    return {
        props: {
            autheticated: true,
            user
        }
    }
}