import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface BookAttrs {
	name: string;
	author: string;
	description: string;
	price: number;
	currency: string;
	image?: string | null;
}

interface BookDoc extends mongoose.Document {
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

bookSchema.statics.build = (attrs: BookAttrs) => {
	return new Book(attrs);
};

const Book = mongoose.model<BookDoc, BookModel>('Book', bookSchema);

export { Book };
