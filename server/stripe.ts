import Stripe from 'stripe';
import { Request, Response } from 'express';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

export async function createCheckoutSession(req: Request, res: Response) {
  try {
    const { items, customerEmail } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    const line_items = items.map((item: any) => ({
      price_data: {
        currency: 'cad',
        product_data: {
          name: item.productNameEn || item.productNameFr,
          images: item.imageUrl ? [item.imageUrl] : [],
        },
        unit_amount: Math.round(parseFloat(item.price) * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      customer_email: customerEmail,
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
    });

    return res.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return res.status(500).json({ error: error.message });
  }
}
