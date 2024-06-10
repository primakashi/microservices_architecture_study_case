import { Subjects } from './subjects';

export interface CheckoutSuccessEvent {
	subject: Subjects.CheckoutSuccess;
	data: {
		userId: string;
		sessionId: string;
	};
}
