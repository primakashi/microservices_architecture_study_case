import { Subjects } from './subjects';

export interface StationeryCreatedEvent {
	subject: Subjects.StationeryCreated;
	data: {
		id: string;
		version: number;
		name: string;
		brand: string;
		description: string;
		price: number;
		currency: string;
		image?: string | null;
	};
}
