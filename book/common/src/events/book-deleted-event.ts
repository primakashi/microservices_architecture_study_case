import { Subjects } from './subjects';

export interface BookDeletedEvent {
	subject: Subjects.BookDeleted;
	data: {
		id: string;
	};
}
