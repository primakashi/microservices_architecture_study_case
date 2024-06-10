import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import {
	requireAuth,
	validateRequest,
	NotFoundError,
} from '@kringel118/common';
import { body } from 'express-validator';
import { Book } from '../models/book';
import { Cart } from '../models/cart';
import { natsWrapper } from '../nats-wrapper';
import { CartCreatedPublisher } from '../events/publishers/cart-created-publisher';
import { Stationery, StationeryDoc } from '../models/stationery';
import { BookDoc } from '../models/book';

const router = express.Router();

router.post(
	'/api/cart',
	requireAuth,
	[
		body('id')
			.not()
			.isEmpty()
			.custom((input: string) => mongoose.Types.ObjectId.isValid(input))
			.withMessage('id must be provided'),
		body('category').not().isEmpty().withMessage('Category must be provided'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { id, category } = req.body;

		let item: BookDoc | StationeryDoc | null;

		switch (category) {
			case 'books':
				// Find the book that the user is trying to add to the cart
				item = await Book.findById(id);

				break;
			case 'stationery':
				// Find the stationery item that the user is trying to add to the cart
				item = await Stationery.findById(id);
				break;
			default:
				res.send('Category must be provided');
		}

		//@ts-ignore
		if (!item) {
			throw new NotFoundError();
		}

		// Build the cart item and save it to the database
		const cart = Cart.build({
			userId: req.currentUser!.id,
			category: category,
			name: item.name,
			description: item.description,
			price: item.price,
			currency: item.currency,
			image: item.image,
			itemId: item.id,
		});
		await cart.save();

		// Publish an event saying that a cart item was created
		new CartCreatedPublisher(natsWrapper.client).publish({
			id: cart.id,
			userId: cart.userId,
			version: cart.version,
			category: cart.category,
			name: cart.name,
			description: cart.description,
			price: cart.price,
			currency: cart.currency,
			image: cart.image,
			itemId: cart.itemId,
		});

		res.status(201).send(cart);
	}
);

export { router as createCartRouter };
