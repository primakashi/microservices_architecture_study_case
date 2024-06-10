import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { CartDoc } from './cart';

interface CheckoutAttrs {
	userId: string;
	sessionId: string;
	cart: any;
	receipt_url?: string | null;
	createdAt: Date;
	payment_status: string;
}

interface CheckoutDoc extends mongoose.Document {
	userId: string;
	sessionId: string;
	cart: any;
	receipt_url?: string | null;
	createdAt: Date;
	payment_status: string;
}

interface CheckoutModel extends mongoose.Model<CheckoutDoc> {
	build(attrs: CheckoutAttrs): CheckoutDoc;
}

const checkoutSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		sessionId: {
			type: String,
			required: true,
		},
		cart: {
			type: mongoose.Schema.Types.Mixed,
		},
		receipt_url: {
			type: String,
		},
		createdAt: {
			type: mongoose.Schema.Types.Date,
			required: true,
		},
		payment_status: {
			type: String,
			required: true,
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
checkoutSchema.set('versionKey', 'version');
checkoutSchema.plugin(updateIfCurrentPlugin);

checkoutSchema.statics.build = (attrs: CheckoutAttrs) => {
	return new Checkout(attrs);
};

const Checkout = mongoose.model<CheckoutDoc, CheckoutModel>(
	'Checkout',
	checkoutSchema
);
export { Checkout };
