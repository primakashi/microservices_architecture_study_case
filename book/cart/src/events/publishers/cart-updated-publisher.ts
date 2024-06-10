import { Publisher, CartUpdatedEvent, Subjects } from '@kringel118/common';

export class CartUpdatedPublisher extends Publisher<CartUpdatedEvent> {
	readonly subject = Subjects.CartUpdated;
}
