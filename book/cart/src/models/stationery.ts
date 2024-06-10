import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface StationeryAttrs {
	id: string;
	name: string;
	brand: string;
	description: string;
	price: number;
	currency: string;
	image?: string | null;
}

export interface StationeryDoc extends mongoose.Document {
	name: string;
	brand: string;
	description: string;
	price: number;
	currency: string;
	image?: string | null;
	version: number;
}

interface StationeryModel extends mongoose.Model<StationeryDoc> {
	build(attrs: StationeryAttrs): StationeryDoc;
	findByEvent(event: {
		id: string;
		version: number;
	}): Promise<StationeryDoc | null>;
}

const stationerySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		brand: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		currency: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			default: null,
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
			},
		},
	}
);

stationerySchema.set('versionKey', 'version');
stationerySchema.plugin(updateIfCurrentPlugin);

stationerySchema.statics.findByEvent = (event: {
	id: string;
	version: number;
}) => {
	return Stationery.findOne({
		_id: event.id,
		version: event.version - 1,
	});
};

stationerySchema.statics.build = (attrs: StationeryAttrs) => {
	return new Stationery({
		_id: attrs.id,
		name: attrs.name,
		brand: attrs.brand,
		description: attrs.description,
		price: attrs.price,
		currency: attrs.currency,
		image: attrs.image,
	});
};

const Stationery = mongoose.model<StationeryDoc, StationeryModel>(
	'Stationery',
	stationerySchema
);

export { Stationery };
