import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
	validateRequest,
	NotFoundError,
	requireAuth,
	BadRequestError,
} from '@kringel118/common';
import { Stationery } from '../models/stationery';
import { StationeryUpdatedPublisher } from '../events/publishers/stationery-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
	'/api/stationery/:id',
	requireAuth,
	[
		body('name').not().isEmpty().withMessage('Title is required'),
		body('brand').not().isEmpty().withMessage('Brand is required'),
		body('description').not().isEmpty().withMessage('Description is required'),
		body('price')
			.isFloat({ gt: 0 })
			.withMessage('Price must be provided and must be greater than 0'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const stationery = await Stationery.findById(req.params.id);

		if (!stationery) {
			throw new NotFoundError();
		}

		// Update stationery item record in the database
		stationery.set({
			name: req.body.name,
			brand: req.body.brand,
			description: req.body.description,
			price: req.body.price,
			currency: req.body.currency,
			image: req.body?.image,
		});
		await stationery.save();

		// Publish an event saying that a stationery item was updated
		new StationeryUpdatedPublisher(natsWrapper.client).publish({
			id: stationery.id,
			name: stationery.name,
			brand: stationery.brand,
			description: stationery.description,
			price: stationery.price,
			version: stationery.version,
			currency: stationery.currency,
			image: stationery?.image,
		});

		res.status(200).send(stationery);
	}
);

export { router as updateStationeryRouter };
