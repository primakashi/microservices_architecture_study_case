import { Subjects } from './subjects';

export interface BookUpdatedEvent {
	subject: Subjects.BookUpdated;
	data: {
		id: string;
		version: number;
		name: string;
		author: string;
		description: string;
		price: number;
		currency: string;
		image?: string | null;
	};
}
