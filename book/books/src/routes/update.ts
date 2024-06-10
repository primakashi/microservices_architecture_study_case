import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
	validateRequest,
	NotFoundError,
	requireAuth,
	BadRequestError,
} from '@kringel118/common';
import { Book } from '../models/book';
import { BookUpdatedPublisher } from '../events/publishers/book-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
	'/api/books/:id',
	requireAuth,
	[
		body('name').not().isEmpty().withMessage('Title is required'),
		body('author').not().isEmpty().withMessage('Author is required'),
		body('description').not().isEmpty().withMessage('Description is required'),
		body('price')
			.isFloat({ gt: 0 })
			.withMessage('Price must be provided and must be greater than 0'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const book = await Book.findById(req.params.id);

		if (!book) {
			throw new NotFoundError();
		}

		// Update book record in the database
		book.set({
			name: req.body.name,
			author: req.body.author,
			description: req.body.description,
			price: req.body.price,
			currency: req.body.currency,
			image: req.body?.image,
		});
		await book.save();

		// Publish an event saying that a book was updated
		new BookUpdatedPublisher(natsWrapper.client).publish({
			id: book.id,
			name: book.name,
			author: book.author,
			description: book.description,
			price: book.price,
			version: book.version,
			currency: book.currency,
			image: book?.image,
		});

		res.status(200).send(book);
	}
);

export { router as updateBookRouter };
