import {
	Publisher,
	Subjects,
	StationeryDeletedEvent,
} from '@kringel118/common';

export class StationeryDeletedPublisher extends Publisher<StationeryDeletedEvent> {
	readonly subject = Subjects.StationeryDeleted;
}
