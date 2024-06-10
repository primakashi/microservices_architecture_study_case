import { Subjects } from './subjects';

export interface BookCreatedEvent {
	subject: Subjects.BookCreated;
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
