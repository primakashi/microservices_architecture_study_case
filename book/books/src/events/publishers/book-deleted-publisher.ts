import { Publisher, Subjects, BookDeletedEvent } from '@kringel118/common';

export class BookDeletedPublisher extends Publisher<BookDeletedEvent> {
	readonly subject = Subjects.BookDeleted;
}
