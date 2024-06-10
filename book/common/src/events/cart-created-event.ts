import { Subjects } from './subjects';
export interface CartCreatedEvent {
	subject: Subjects.CartCreated;
	data: {
		id: string;
		userId: string;
		version: number;
		category: string;
		name: string;
		description: string;
		price: number;
		currency: string;
		image?: string | null;
		itemId: string;
	};
}
