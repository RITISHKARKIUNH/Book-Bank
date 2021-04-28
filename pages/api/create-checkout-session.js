import Stripe from "stripe";
import { withSSRContext, API } from 'aws-amplify';
import Amplify from 'aws-amplify';
import config from '../../aws-exports';
Amplify.configure({ ...config, ssr: true });

import { updateBook } from '../../graphql/mutations';
const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`);
const DOMAIN = 'http://localhost:3000/cart';
export default async (req, res) => {

    let { amount, lineItems } = req.body;
    const { Auth } = withSSRContext({ req });

    lineItems = lineItems.map(item =>{
        let processedItem = {};
        processedItem.quantity = 1;
        processedItem.price_data = {};
        processedItem.price_data.currency ='usd';
        processedItem.price_data.unit_amount = parseFloat(item.price) * 100;
        processedItem.price_data.product_data = {};
        processedItem.price_data.product_data.name = item.title;
        return processedItem;
    });

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${DOMAIN}?success=true`,
        cancel_url: `${DOMAIN}?canceled=true`,
    });

    res.json({ id: session.id });
}