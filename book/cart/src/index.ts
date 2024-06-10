import mongoose from 'mongoose';
import { natsWrapper } from './nats-wrapper';
import { BookCreatedListener } from './events/listeners/book-created-listener';
import { BookUpdatedListener } from './events/listeners/book-updated-listener';
import { StationeryCreatedListener } from './events/listeners/stationery-created-listener';
import { StationeryUpdatedListener } from './events/listeners/stationery-updated-listener';
import { CheckoutSuccessListener } from './events/listeners/checkout-success-listener';
import { app } from './app';

const start = async () => {
	if (!process.env.JWT_KEY) {
		throw new Error('JWT_KEY must be defined');
	}
	if (!process.env.MONGO_URI) {
		throw new Error('MONGO_URI must be defined');
	}
	if (!process.env.NATS_CLIENT_ID) {
		throw new Error('NATS_CLIENT_ID must be defined');
	}
	if (!process.env.NATS_URL) {
		throw new Error('NATS_URL must be defined');
	}
	if (!process.env.NATS_CLUSTER_ID) {
		throw new Error('NATS_CLUSTER_ID must be defined');
	}

	try {
		await natsWrapper.connect(
			process.env.NATS_CLUSTER_ID,
			process.env.NATS_CLIENT_ID,
			process.env.NATS_URL
		);
		natsWrapper.client.on('close', () => {
			console.log('NATS connection closed!');
			process.exit();
		});
		process.on('SIGINT', () => natsWrapper.client.close());
		process.on('SIGTERM', () => natsWrapper.client.close());

		new BookCreatedListener(natsWrapper.client).listen();
		new BookUpdatedListener(natsWrapper.client).listen();
		new StationeryCreatedListener(natsWrapper.client).listen();
		new StationeryUpdatedListener(natsWrapper.client).listen();
		new CheckoutSuccessListener(natsWrapper.client).listen();

		await mongoose.connect(process.env.MONGO_URI);
	} catch (err) {
		console.error(err);
	}

	app.listen(3000, () => {
		console.log('Listening on port 3000!');
	});
};

start();
