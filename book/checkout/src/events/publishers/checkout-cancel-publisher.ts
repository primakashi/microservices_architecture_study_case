import { Publisher, CheckoutCancelEvent, Subjects } from '@kringel118/common';

export class CheckoutCancelPublisher extends Publisher<CheckoutCancelEvent> {
	readonly subject = Subjects.CheckoutCancel;
}
