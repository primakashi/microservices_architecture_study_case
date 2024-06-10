import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface BookAttrs {
	id: string;
	name: string;
	author: string;
	description: string;
	price: number;
	currency: string;
	image?: string | null;
}

export interface BookDoc extends mongoose.Document {
	name: string;
	author: string;
	description: string;
	price: number;
	currency: string;
	image?: string | null;
	version: number;
}

interface BookModel extends mongoose.Model<BookDoc> {
	build(attrs: BookAttrs): BookDoc;
	findByEvent(event: { id: string; version: number }): Promise<BookDoc | null>;
}

const bookSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		author: {
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
			min: 0,
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

bookSchema.set('versionKey', 'version');
bookSchema.plugin(updateIfCurrentPlugin);

bookSchema.statics.findByEvent = (event: { id: string; version: number }) => {
	return Book.findOne({
		_id: event.id,
		version: event.version - 1,
	});
};

bookSchema.statics.build = (attrs: BookAttrs) => {
	return new Book({
		_id: attrs.id,
		name: attrs.name,
		author: attrs.author,
		description: attrs.description,
		price: attrs.price,
		currency: attrs.currency,
		image: attrs.image,
	});
};

const Book = mongoose.model<BookDoc, BookModel>('Book', bookSchema);

export { Book };
