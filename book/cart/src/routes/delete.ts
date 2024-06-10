import express, { Request, Response } from 'express';
import {
	requireAuth,
	NotFoundError,
	NotAuthorizedError,
} from '@kringel118/common';
import { body } from 'express-validator';
import { Cart } from '../models/cart';
import { natsWrapper } from '../nats-wrapper';
import { CartDeletedPublisher } from '../events/publishers/cart-deleted-publisher';

const router = express.Router();

router.delete(
	'/api/cart/:id',
	requireAuth,
	async (req: Request, res: Response) => {
		const cart = await Cart.findByIdAndDelete(req.params.id);

		if (!cart) {
			throw new NotFoundError();
		}

		if (cart.userId !== req.currentUser!.id) {
			throw new NotAuthorizedError();
		}

		// Publish an event saying that a cart item was deleted
		new CartDeletedPublisher(natsWrapper.client).publish({
			id: cart.id,
		});

		res.status(202).send({ message: 'Cart was deleted!' });
	}
);

export { router as deleteCartRouter };
