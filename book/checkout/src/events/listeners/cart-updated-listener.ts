import { Message } from 'node-nats-streaming';
import {
	Subjects,
	Listener,
	CartUpdatedEvent,
	NotFoundError,
} from '@kringel118/common';
import { queueGroupName } from './queue-group-name';
import { Cart } from '../../models/cart';

export class CartUpdatedListener extends Listener<CartUpdatedEvent> {
	readonly subject = Subjects.CartUpdated;
	queueGroupName = queueGroupName;

	async onMessage(data: CartUpdatedEvent['data'], msg: Message) {
		const cart = await Cart.findById(data.id);

		if (!cart) {
			throw new NotFoundError();
		}

		// Update quantity
		cart.set({
			quantity: data.quantity,
		});

		await cart.save();

		msg.ack();
	}
}
