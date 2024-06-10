import { Message } from 'node-nats-streaming';
import {
	Subjects,
	Listener,
	CartDeletedEvent,
	NotFoundError,
} from '@kringel118/common';
import { queueGroupName } from './queue-group-name';
import { Cart } from '../../models/cart';

export class CartDeletedListener extends Listener<CartDeletedEvent> {
	readonly subject = Subjects.CartDeleted;
	queueGroupName = queueGroupName;

	async onMessage(data: CartDeletedEvent['data'], msg: Message) {
		const cart = await Cart.findByIdAndDelete(data.id);

		if (!cart) {
			throw new NotFoundError();
		}

		msg.ack();
	}
}
