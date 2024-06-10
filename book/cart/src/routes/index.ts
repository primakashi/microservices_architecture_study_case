import express, { Request, Response } from 'express';
import { requireAuth } from '@kringel118/common';
import { Cart } from '../models/cart';

const router = express.Router();

router.get('/api/cart', requireAuth, async (req: Request, res: Response) => {
	const cart = await Cart.find({
		userId: req.currentUser!.id,
	});

	if (!cart) {
		throw new Error('Cart is empty!');
	}

	const amount_total = cart
		.map(item => item.price * item.quantity)
		.reduce((a, b) => a + b, 0);
	const products_total = cart.length;

	if (req.query.total) {
		res.status(200).send({
			amount_total: amount_total,
			products_total: products_total,
		});
	} else {
		res.status(200).send({
			cart: cart,
			amount_total: amount_total,
			products_total: products_total,
		});
	}
});

export { router as indexCartRouter };
