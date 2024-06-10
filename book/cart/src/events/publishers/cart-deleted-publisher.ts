import { Publisher, CartDeletedEvent, Subjects } from '@kringel118/common';

export class CartDeletedPublisher extends Publisher<CartDeletedEvent> {
	readonly subject = Subjects.CartDeleted;
}
