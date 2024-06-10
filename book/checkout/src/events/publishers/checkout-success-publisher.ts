import { Publisher, CheckoutSuccessEvent, Subjects } from '@kringel118/common';

export class CheckoutSuccessPublisher extends Publisher<CheckoutSuccessEvent> {
	readonly subject = Subjects.CheckoutSuccess;
}
