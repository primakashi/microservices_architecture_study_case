import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface StationeryAttrs {
	name: string;
	brand: string;
	description: string;
	price: number;
	currency: string;
	image?: string | null;
}

interface StationeryDoc extends mongoose.Document {
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
}

const StationerySchema = new mongoose.Schema(
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

StationerySchema.set('versionKey', 'version');
StationerySchema.plugin(updateIfCurrentPlugin);

StationerySchema.statics.build = (attrs: StationeryAttrs) => {
	return new Stationery(attrs);
};

const Stationery = mongoose.model<StationeryDoc, StationeryModel>(
	'Stationery',
	StationerySchema
);

export { Stationery };
