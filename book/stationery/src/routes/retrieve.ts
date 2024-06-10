import express, { Request, Response } from 'express';
import { NotFoundError } from '@kringel118/common';
import { Stationery } from '../models/stationery';

const router = express.Router();

router.get('/api/stationery/:id', async (req: Request, res: Response) => {
	const stationery = await Stationery.findById(req.params.id);

	if (!stationery) {
		throw new NotFoundError();
	}

	res.status(200).send(stationery);
});

export { router as retrieveStationeryRouter };
