import express, { Request, Response } from 'express';
import { Stationery } from '../models/stationery';
const router = express.Router();

router.get('/api/stationery', async (req: Request, res: Response) => {
	const stationery = await Stationery.find({});

	res.send(stationery);
});

export { router as indexStationeryRouter };
