import {
	Publisher,
	Subjects,
	StationeryCreatedEvent,
} from '@kringel118/common';

export class StationeryCreatedPublisher extends Publisher<StationeryCreatedEvent> {
	readonly subject = Subjects.StationeryCreated;
}
