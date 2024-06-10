import express, { Request, Response } from 'express';
import { requireAuth, NotFoundError } from '@kringel118/common';
import { Cart } from '../models/cart';

import Stripe, { stripe } from '../stripe';

const router = express.Router();

router.post(
	'/api/checkout',
	requireAuth,
	async (req: Request, res: Response) => {
		const cart = await Cart.find({
			userId: req.currentUser!.id,
		});

		if (!cart) {
			throw new NotFoundError();
		}

		const line_items = cart.map(item => {
			const { name, currency, price, image, itemId, quantity } = item;

			const price_data = {
				currency: currency,
				product_data: {
					name: name,
					images: [`${image}`],
					metadata: {
						itemId: itemId,
					},
				},
				unit_amount: price,
			};

			return {
				price_data,
				quantity,
				adjustable_quantity: {
					enabled: true,
				},
			};
		});

		const params: Stripe.Checkout.SessionCreateParams = {
			customer_email: req.currentUser!.email,
			submit_type: 'pay',
			mode: 'payment',
			payment_method_types: ['card'],
			allow_promotion_codes: true,
			line_items,
			success_url: `${req.headers.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${req.headers.origin}/checkout/cancel?session_id={CHECKOUT_SESSION_ID}`,
		};

		try {
			const checkoutSession: Stripe.Checkout.Session =
				await stripe.checkout.sessions.create(params);
			res.status(200).send(checkoutSession);
		} catch (err) {
			res.send(err);
		}
	}
);

export { router as createCheckoutRouter };
