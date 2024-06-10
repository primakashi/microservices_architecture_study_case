import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface CartAttrs {
	userId: string;
	category: string;
	name: string;
	description: string;
	price: number;
	currency: string;
	image?: string | null;
	itemId: string;
}

export interface CartDoc extends mongoose.Document {
	userId: string;
	category: string;
	name: string;
	description: string;
	price: number;
	currency: string;
	image?: string | null;
	itemId: string;
	quantity: number;
	version: number;
}

interface CartModel extends mongoose.Model<CartDoc> {
	build(attrs: CartAttrs): CartDoc;
}

const cartSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		name: {
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
		itemId: {
			type: String,
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
			min: 1,
			default: 1,
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
cartSchema.set('versionKey', 'version');
cartSchema.plugin(updateIfCurrentPlugin);

cartSchema.statics.build = (attrs: CartAttrs) => {
	return new Cart({
		userId: attrs.userId,
		category: attrs.category,
		name: attrs.name,
		description: attrs.description,
		price: attrs.price,
		currency: attrs.currency,
		image: attrs.image,
		itemId: attrs.itemId,
	});
};

const Cart = mongoose.model<CartDoc, CartModel>('Cart', cartSchema);
export { Cart };
