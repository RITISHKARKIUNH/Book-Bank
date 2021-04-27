import Stripe from "stripe";
const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`);
export default async (req, res) => {
    const { id, amount } = req.body;
    try {

    } catch(error) {
        console.log(error);
    }
}