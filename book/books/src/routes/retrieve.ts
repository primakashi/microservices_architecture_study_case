import express, { Request, Response } from 'express';
import { NotFoundError } from '@kringel118/common';
import { Book } from '../models/book';

const router = express.Router();

router.get('/api/books/:id', async (req: Request, res: Response) => {
	const book = await Book.findById(req.params.id);

	if (!book) {
		throw new NotFoundError();
	}

	res.status(200).send(book);
});

export { router as retrieveBookRouter };
