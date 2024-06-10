import { Publisher, OrderCreatedEvent, Subjects } from '@prticketingms/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
