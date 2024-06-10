import express, { Request, Response } from 'express';
import { requireAuth, NotFoundError } from '@kringel118/common';
import { Checkout } from '../models/checkout';
const router = express.Router();

router.get(
	'/api/checkout/',
	requireAuth,
	async (req: Request, res: Response) => {
		const checkout = await Checkout.find({
			userId: req.currentUser!.id,
		}).populate('cart');

		if (!checkout) {
			throw new NotFoundError();
		}

		res.status(200).send(checkout);
	}
);

export { router as indexCheckoutRouter };
