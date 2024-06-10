import express, { Request, Response } from 'express';
import {
	requireAuth,
	NotAuthorizedError,
	NotFoundError,
} from '@kringel118/common';
import { Checkout } from '../models/checkout';

const router = express.Router();

router.delete(
	'/api/checkout/:orderId',
	requireAuth,
	async (req: Request, res: Response) => {
		const order = await Checkout.findByIdAndDelete(req.params.orderId);

		if (!order) {
			throw new NotFoundError();
		}

		if (order.userId !== req.currentUser!.id) {
			throw new NotAuthorizedError();
		}

		res.status(202).send({});
	}
);

export { router as deleteCheckoutRouter };
