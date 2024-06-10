import express, { Request, Response } from 'express';
import { requireAuth, NotFoundError } from '@kringel118/common';
import { natsWrapper } from '../nats-wrapper';
import { Stationery } from '../models/stationery';
import { StationeryDeletedPublisher } from '../events/publishers/stationery-deleted-publisher';

const router = express.Router();

router.delete(
	'/api/stationery/:id',
	requireAuth,
	async (req: Request, res: Response) => {
		const stationery = await Stationery.findByIdAndDelete(req.params.id);

		if (!stationery) {
			throw new NotFoundError();
		}

		//TODO: add auth for admin

		// Publish an event saying that a stationery item was deleted
		new StationeryDeletedPublisher(natsWrapper.client).publish({
			id: stationery.id,
		});

		res.status(202).send({});
	}
);

export { router as deleteStationeryRouter };
