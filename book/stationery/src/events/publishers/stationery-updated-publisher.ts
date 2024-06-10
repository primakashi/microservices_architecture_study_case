import {
	Publisher,
	Subjects,
	StationeryUpdatedEvent,
} from '@kringel118/common';

export class StationeryUpdatedPublisher extends Publisher<StationeryUpdatedEvent> {
	readonly subject = Subjects.StationeryUpdated;
}
