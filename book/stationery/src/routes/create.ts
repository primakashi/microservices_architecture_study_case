import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@kringel118/common';
import { Stationery } from '../models/stationery';
import { StationeryCreatedPublisher } from '../events/publishers/stationery-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
	'/api/stationery',
	requireAuth,
	[
		body('name').not().isEmpty().withMessage('Title is required'),
		body('brand').not().isEmpty().withMessage('Brand is required'),
		body('description').not().isEmpty().withMessage('Description is required'),
		body('price')
			.isFloat({ gt: 0 })
			.withMessage('Price must be greater than 0'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { name, brand, description, currency, image } = req.body;

		const price = req.body.price * 100;

		// Build the stationery and save it to the database
		const stationery = Stationery.build({
			name,
			brand,
			description,
			price,
			currency,
			image,
		});
		await stationery.save();

		// Publish an event saying that a book was created
		new StationeryCreatedPublisher(natsWrapper.client).publish({
			id: stationery.id,
			name: stationery.name,
			brand: stationery.brand,
			description: stationery.description,
			price: stationery.price,
			version: stationery.version,
			currency: stationery.currency,
			image: stationery?.image,
		});

		res.status(201).send(stationery);
	}
);

export { router as createStationeryRouter };
