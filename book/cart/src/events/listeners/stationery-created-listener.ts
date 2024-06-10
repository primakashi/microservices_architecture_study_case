import { Message } from 'node-nats-streaming';
import { Subjects, Listener, StationeryCreatedEvent } from '@kringel118/common';
import { Stationery } from '../../models/stationery';
import { queueGroupName } from './queue-group-name';

export class StationeryCreatedListener extends Listener<StationeryCreatedEvent> {
	readonly subject = Subjects.StationeryCreated;
	queueGroupName = queueGroupName;

	async onMessage(data: StationeryCreatedEvent['data'], msg: Message) {
		const { id, name, brand, description, price, currency, image } = data;

		const stationery = Stationery.build({
			id,
			name,
			brand,
			description,
			price,
			currency,
			image,
		});
		await stationery.save();

		msg.ack();
	}
}
