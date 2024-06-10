import { Publisher, Subjects, BookCreatedEvent } from '@kringel118/common';

export class BookCreatedPublisher extends Publisher<BookCreatedEvent> {
	readonly subject = Subjects.BookCreated;
}
