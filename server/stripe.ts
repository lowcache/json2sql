import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
});

export const getStripeCustomerByEmail = async (email: string) => {
  const customers = await stripe.customers.list({ email });
  return customers.data[0];
};

export const createStripeCustomer = async (email: string) => {
  return stripe.customers.create({ email });
};

export const createPaymentIntent = async (
  customerId: string,
  amount: number,
) => {
  return stripe.paymentIntents.create({
    customer: customerId,
    amount,
    currency: "usd",
    payment_method_types: ["card"],
  });
};
