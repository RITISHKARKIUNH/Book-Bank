import Stripe from "stripe";
import { withSSRContext } from 'aws-amplify';
import Amplify from 'aws-amplify';
import config from '../../../aws-exports';
Amplify.configure({ ...config, ssr: true });
import { updateBook } from '../../../graphql/mutations';
const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`);

async function updateBooks(API, user, lineItems) {
    let updatedBooks = lineItems.map(item => {
        let updated = item;
        updated.availability = "Not available";
        updated.boughtBy = user.username;
        if(updated.createdAt) delete updated.createdAt;
        if(updated.updatedAt) delete  updated.updatedAt;
        return updated;
    });

    const graphqlPromises = updatedBooks.map(book => {
        return API.graphql({ query: updateBook, variables: { input: book } });
    });

    return Promise.all(graphqlPromises)
        .then(results => {
            return results;
        })
        .catch(err => {
            return err;
        });
}

export default async (req, res) => {
    const { id, amount, lineItems } = req.body;
    const { Auth, API } = withSSRContext({ req });

    try {
        if (req.method === 'POST') {
            const user = await Auth.currentAuthenticatedUser();
            if (user && user.username) {
                const payment = await stripe.paymentIntents.create({
                    amount,
                    currency: "USD",
                    description: `payment from user ${user?.username ? user.username : ''}`,
                    payment_method: id,
                    confirm: true
                });
                const updatedBooks = await updateBooks(API, user, lineItems);
                
                return res.status(200).json({
                    transactionDetails: payment,
                    data: updatedBooks
                });
            } else {
                throw ('No user found');
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: error.message
        });
    }
}