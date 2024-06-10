import { Message } from 'node-nats-streaming';
import {
	Subjects,
	Listener,
	CartCreatedEvent,
	NotFoundError,
} from '@kringel118/common';
import { queueGroupName } from './queue-group-name';
import { Cart } from '../../models/cart';

export class CartCreatedListener extends Listener<CartCreatedEvent> {
	readonly subject = Subjects.CartCreated;
	queueGroupName = queueGroupName;

	async onMessage(data: CartCreatedEvent['data'], msg: Message) {
		const {
			id,
			userId,
			category,
			name,
			description,
			price,
			currency,
			image,
			itemId,
		} = data;

		// Build the cart item and save it to the database
		const cart = Cart.build({
			id,
			userId,
			category,
			name,
			description,
			price,
			currency,
			image,
			itemId,
		});
		await cart.save();

		msg.ack();
	}
}
