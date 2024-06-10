import express, { Request, Response } from 'express';
import { requireAuth } from '@prticketingms/common';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate('ticket');
  const order = await Order.findById('65084a457c92342e8d970851')
console.log(order)
  res.send(orders);
});

export { router as indexOrderRouter };
