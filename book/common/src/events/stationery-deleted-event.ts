import { Subjects } from './subjects';

export interface StationeryDeletedEvent {
	subject: Subjects.StationeryDeleted;
	data: {
		id: string;
	};
}
