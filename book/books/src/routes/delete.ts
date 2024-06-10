import express, { Request, Response } from 'express';
import { requireAuth, NotFoundError } from '@kringel118/common';
import { natsWrapper } from '../nats-wrapper';
import { Book } from '../models/book';
import { BookDeletedPublisher } from '../events/publishers/book-deleted-publisher';

const router = express.Router();

router.delete(
	'/api/books/:id',
	requireAuth,
	async (req: Request, res: Response) => {
		const book = await Book.findByIdAndDelete(req.params.id);

		if (!book) {
			throw new NotFoundError();
		}

		//TODO: add auth for admin

		// Publish an event saying that a book was deleted
		new BookDeletedPublisher(natsWrapper.client).publish({
			id: book.id,
		});

		res.status(202).send({});
	}
);

export { router as deleteBookRouter };
