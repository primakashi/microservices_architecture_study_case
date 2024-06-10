import { Publisher, Subjects, BookUpdatedEvent } from '@kringel118/common';

export class BookUpdatedPublisher extends Publisher<BookUpdatedEvent> {
	readonly subject = Subjects.BookUpdated;
}
