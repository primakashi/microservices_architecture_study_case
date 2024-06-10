import { Message } from 'node-nats-streaming';
import { Listener, Subjects, BookUpdatedEvent } from '@kringel118/common';
import { Book } from '../../models/book';
import { queueGroupName } from './queue-group-name';

export class BookUpdatedListener extends Listener<BookUpdatedEvent> {
	readonly subject = Subjects.BookUpdated;
	queueGroupName = queueGroupName;

	async onMessage(data: BookUpdatedEvent['data'], msg: Message) {
		const book = await Book.findByEvent(data);

		if (!book) {
			throw new Error('Book not found');
		}

		const { name, author, description, price, image } = data;
		book.set({ name, author, description, price, image });
		await book.save();

		msg.ack();
	}
}
