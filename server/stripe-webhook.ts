import Stripe from 'stripe';
import { Request, Response } from 'express';
import { DbStorage } from './db/storage';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

const storage = new DbStorage();

export async function stripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    // You can expand line_items if needed
    // const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    const metadata = session.metadata ? JSON.parse(session.metadata.order) : null;
    if (metadata) {
      // Save order to DB
      await storage.createOrder(metadata.orderData);
      // Reduce product quantities
      for (const item of metadata.items) {
        // If you have a stock/quantity field, update it here. If not, skip or set inStock to false if out of stock.
        // Example (if you have a stock field):
        // await storage.updateProduct(item.productId, { stock: metadata.productStock[item.productId] - item.quantity });
        // If only inStock boolean, set to false if quantity is 0
        // await storage.updateProduct(item.productId, { inStock: metadata.productStock[item.productId] - item.quantity <= 0 ? false : true });
      }
    }
  }
  res.json({ received: true });
}
