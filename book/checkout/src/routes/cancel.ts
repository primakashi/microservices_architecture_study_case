import express, { Request, Response } from 'express';
import { requireAuth } from '@kringel118/common';
import { natsWrapper } from '../nats-wrapper';
import { CheckoutCancelPublisher } from '../events/publishers/checkout-cancel-publisher';
import { stripe } from '../stripe';
import { Checkout } from '../models/checkout';
import { Cart } from '../models/cart';

const router = express.Router();

router.get(
	'/api/checkout/:sessionId/cancel',
	requireAuth,
	async (req: Request, res: Response) => {
		const existingCheckout = await Checkout.find({
			userId: req.currentUser!.id,
			sessionId: req.params.sessionId,
		});

		if (!existingCheckout.length) {
			const cart = await Cart.find({
				userId: req.currentUser!.id,
			});

			const session = await stripe.checkout.sessions.retrieve(
				req.params.sessionId
			);

			const paymentIntent = await stripe.paymentIntents.cancel(
				session.payment_intent as string
			);

			const checkout = Checkout.build({
				userId: req.currentUser!.id,
				sessionId: session.id,
				cart,
				createdAt: new Date(),
				payment_status: paymentIntent.status,
			});
			await checkout.save();

			new CheckoutCancelPublisher(natsWrapper.client).publish({
				userId: req.currentUser!.id,
				sessionId: session.id,
			});

			res.status(200).send([checkout]);
		} else {
			res.status(200).send(existingCheckout);
		}
	}
);

export { router as cancelCheckoutRouter };
