import { Subjects } from './subjects';

export interface CheckoutCancelEvent {
	subject: Subjects.CheckoutCancel;
	data: {
		userId: string;
		sessionId: string;
	};
}
