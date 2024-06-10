import { Subjects } from './subjects';

export interface CartUpdatedEvent {
	subject: Subjects.CartUpdated;
	data: {
		id: string;
		version: number;
		quantity: number;
	};
}
