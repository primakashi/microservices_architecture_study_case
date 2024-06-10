import { Message } from 'node-nats-streaming';
import { Subjects, Listener, CheckoutSuccessEvent } from '@kringel118/common';
import { Cart } from '../../models/cart';
import { queueGroupName } from './queue-group-name';

export class CheckoutSuccessListener extends Listener<CheckoutSuccessEvent> {
	readonly subject = Subjects.CheckoutSuccess;
	queueGroupName = queueGroupName;

	async onMessage(data: CheckoutSuccessEvent['data'], msg: Message) {
		const { userId } = data;

		// Empty cart on success payment
		await Cart.deleteMany({ userId: userId });

		msg.ack();
	}
}
