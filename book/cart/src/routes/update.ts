import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import {
	requireAuth,
	NotFoundError,
	NotAuthorizedError,
	validateRequest,
} from '@kringel118/common';
import { Cart } from '../models/cart';
import { natsWrapper } from '../nats-wrapper';
import { CartUpdatedPublisher } from '../events/publishers/cart-updated-publisher';

const router = express.Router();

router.put(
	'/api/cart/:id',
	requireAuth,
	[body('quantity').not().isEmpty().withMessage('Quantity is required')],
	validateRequest,
	async (req: Request, res: Response) => {
		// Find the cart item that the user is trying to increment
		const cart = await Cart.findById(req.params.id);

		if (!cart) {
			throw new NotFoundError();
		}

		if (cart.userId !== req.currentUser!.id) {
			throw new NotAuthorizedError();
		}

		// Update quantity
		cart.set({
			quantity: req.body.quantity,
		});

		await cart.save();

		// Publish an event saying that a cart item was updated
		new CartUpdatedPublisher(natsWrapper.client).publish({
			id: cart.id,
			version: cart.version,
			quantity: cart.quantity,
		});

		res.status(200).send(cart);
	}
);

export { router as updateCartRouter };
