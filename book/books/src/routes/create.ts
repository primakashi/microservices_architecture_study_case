import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@kringel118/common';
import { Book } from '../models/book';
import { BookCreatedPublisher } from '../events/publishers/book-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
	'/api/books',
	requireAuth,
	[
		body('name').not().isEmpty().withMessage('Title is required'),
		body('author').not().isEmpty().withMessage('Author is required'),
		body('description').not().isEmpty().withMessage('Description is required'),
		body('price')
			.isFloat({ gt: 0 })
			.withMessage('Price must be greater than 0'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { name, author, description, currency, image } = req.body;

		const price = req.body.price * 100;

		// Build the book and save it to the database
		const book = Book.build({
			name,
			author,
			description,
			price,
			currency,
			image,
		});
		await book.save();

		// Publish an event saying that a book was created
		new BookCreatedPublisher(natsWrapper.client).publish({
			id: book.id,
			name: book.name,
			author: book.author,
			description: book.description,
			price: book.price,
			version: book.version,
			currency: book.currency,
			image: book?.image,
		});

		res.status(201).send(book);
	}
);

export { router as createBookRouter };
