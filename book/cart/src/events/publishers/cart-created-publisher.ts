import { Publisher, CartCreatedEvent, Subjects } from '@kringel118/common';

export class CartCreatedPublisher extends Publisher<CartCreatedEvent> {
	readonly subject = Subjects.CartCreated;
}
