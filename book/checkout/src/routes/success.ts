import express, { Request, Response } from 'express';
import { requireAuth } from '@kringel118/common';
import { Cart } from '../models/cart';
import { natsWrapper } from '../nats-wrapper';
import { CheckoutSuccessPublisher } from '../events/publishers/checkout-success-publisher';
import { stripe } from '../stripe';
import { Checkout } from '../models/checkout';

const router = express.Router();

router.get(
	'/api/checkout/:sessionId/success',
	requireAuth,
	async (req: Request, res: Response) => {
		const existingCheckout = await Checkout.find({
			userId: req.currentUser!.id,
			sessionId: req.params.sessionId,
		});

		const session = await stripe.checkout.sessions.retrieve(
			req.params.sessionId
		);

		const paymentIntent = await stripe.paymentIntents.retrieve(
			session.payment_intent as string
		);

		const payment_method = await stripe.paymentMethods.retrieve(
			paymentIntent.payment_method as string
		);

		if (!existingCheckout.length) {
			const cart = await Cart.find({
				userId: req.currentUser!.id,
			});

			const checkout = Checkout.build({
				userId: req.currentUser!.id,
				sessionId: session.id,
				cart,
				receipt_url: paymentIntent.charges.data[0].receipt_url,
				createdAt: new Date(),
				payment_status: paymentIntent.status,
			});
			await checkout.save();

			new CheckoutSuccessPublisher(natsWrapper.client).publish({
				userId: req.currentUser!.id,
				sessionId: session.id,
			});

			await Cart.deleteMany({ userId: req.currentUser!.id });

			res.status(200).send({
				checkout: [checkout],
				payment_method: payment_method.card,
			});
		} else {
			res.status(200).send({
				checkout: existingCheckout,
				payment_method: payment_method.card,
			});
		}
	}
);

export { router as successCheckoutRouter };
