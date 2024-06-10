import { Subjects } from './subjects';

export interface StationeryUpdatedEvent {
	subject: Subjects.StationeryUpdated;
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
