import Stripe from "stripe";
import { withSSRContext } from 'aws-amplify';
import Amplify from 'aws-amplify';
import config from '../../../aws-exports';
Amplify.configure({ ...config, ssr: true });
import { updateBook } from '../../../graphql/mutations';
import { getUser } from "../../../graphql/queries";
const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`);
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
import { toast } from 'react-toastify';

async function sendPurchaseEmail(bookOwnerId, user, API) {
    const buyer = await API.graphql({ query: getUser, variables: { id: user.username } });
    const recepientEmails = [];

    // loop through book owber list and pull their data;
    const receipientEmailPromise = new Promise((resolve, reject) => {
        bookOwnerId.forEach(async (owner, index) => {
            const user = await API.graphql({ query: getUser, variables: { id: owner } });
            console.log(index, user);
            if (user && user.data && user.data.getUser.email) {
                recepientEmails.push(user.data.getUser.email);
                if (index === bookOwnerId.length - 1) resolve();
            }
        });
    });

    //receipient email resolved
    receipientEmailPromise.then(() => {
        console.log(buyer, recepientEmails);
        const sourceEmailAddress = "ritish@impct.co";
        const buyerData = buyer.data.getUser;
        const textMsg = `Hello !!! \n The book you had listed in bookbank portal has been purchased by ${buyerData.firstName} ${buyerData.lastName}. Please contact him about the book delivery.\nThese are the buyers personal details:\nName: ${buyerData.firstName} ${buyerData.lastName}\nEmail: ${buyerData.email}\nPhone Number: ${buyerData.phoneNumber}\nThank your for using our platform.\nSincerely\nBook Bank Team`;
        const messageHtml = `<div><h1>Hello !!!</h1><p>The book you had listed in bookbank portal has been purchased by <b>${buyerData.firstName} ${buyerData.lastName}</b>. Please contact him about the book delivery.</p><p>These are the buyers contact details:</p><p><b>Name: ${buyerData.firstName} ${buyerData.lastName}</b></p><p><b>Email: ${buyerData.email}</b></p><p><b>Phone Number: ${buyerData.phoneNumber}</b></p><p>Thank your for using our platform.</p><p>Sincerely</p><p><b>Book Bank Team</b></p></div>`;
        const msg = {
            to: recepientEmails,
            from: `${sourceEmailAddress}`,
            subject: 'Your listed book was purchased',
            text: `${textMsg}`,
            html: `${messageHtml}`,
        }

        sgMail
            .send(msg)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                console.error(error)
                return error;
            });
    });
};

async function updateBooks(API, user, lineItems) {
    let bookOwnerId = [];

    let updatedBooks = lineItems.map(item => {
        if (!bookOwnerId.includes(item.username)) bookOwnerId.push(item.username);
        let updated = item;
        updated.availability = "Not available";
        updated.boughtBy = user.username;
        if (updated.createdAt) delete updated.createdAt;
        if (updated.updatedAt) delete updated.updatedAt;
        return updated;
    });

    const graphqlPromises = updatedBooks.map(book => {
        return API.graphql({ query: updateBook, variables: { input: book } });
    });

    return Promise.all(graphqlPromises)
        .then(results => {
            return {
                result: results,
                bookOwnerId: bookOwnerId
            }
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
                if (updatedBooks) {
                    console.log(updatedBooks, typeof (updatedBooks), payment);
                    const emailRes = await sendPurchaseEmail(updatedBooks.bookOwnerId, user, API);
                    console.log(emailRes);
                }
                return res.status(200).json({
                    transactionDetails: payment,
                    data: updatedBooks
                });
            } else {
                throw ('No user found');
            }
        }
    } catch (error) {
        toast.error(error.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        console.log("yaha bata ako ho", error);
        return res.status(400).json({
            message: error.message
        });
    }
}