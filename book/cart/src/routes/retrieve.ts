import express, { Request, Response } from 'express';
import { requireAuth, NotFoundError } from '@kringel118/common';
import { Cart } from '../models/cart';

const router = express.Router();

router.get(
	'/api/cart/:id',
	requireAuth,
	async (req: Request, res: Response) => {
		// Find if this book is already in user's cart
		const cart = await Cart.findOne({
			userId: req.currentUser!.id,
			//@ts-ignore
			itemId: req.params.id,
		});

		if (!cart) {
			res.status(200).send({});
		} else {
			res.status(200).send(cart.id);
		}
	}
);

export { router as retrieveCartRouter };
