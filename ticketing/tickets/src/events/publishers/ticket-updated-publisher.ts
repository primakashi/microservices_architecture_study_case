import { Publisher, Subjects, TicketUpdatedEvent } from '@prticketingms/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
