import { Message } from 'node-nats-streaming';
import { Listener, Subjects, StationeryUpdatedEvent } from '@kringel118/common';
import { Stationery } from '../../models/stationery';
import { queueGroupName } from './queue-group-name';

export class StationeryUpdatedListener extends Listener<StationeryUpdatedEvent> {
	readonly subject = Subjects.StationeryUpdated;
	queueGroupName = queueGroupName;

	async onMessage(data: StationeryUpdatedEvent['data'], msg: Message) {
		const stationery = await Stationery.findByEvent(data);

		if (!stationery) {
			throw new Error('Stationery item not found');
		}

		const { name, brand, description, price, image } = data;
		stationery.set({ name, brand, description, price, image });
		await stationery.save();

		msg.ack();
	}
}
