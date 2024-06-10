import { Message } from 'node-nats-streaming';
import { Subjects, Listener, BookCreatedEvent } from '@kringel118/common';
import { Book } from '../../models/book';
import { queueGroupName } from './queue-group-name';

export class BookCreatedListener extends Listener<BookCreatedEvent> {
	readonly subject = Subjects.BookCreated;
	queueGroupName = queueGroupName;

	async onMessage(data: BookCreatedEvent['data'], msg: Message) {
		const { id, name, author, description, price, currency, image } = data;

		const book = Book.build({
			id,
			name,
			author,
			description,
			price,
			currency,
			image,
		});
		await book.save();

		msg.ack();
	}
}
