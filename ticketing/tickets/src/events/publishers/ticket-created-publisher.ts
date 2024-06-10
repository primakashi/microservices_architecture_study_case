import { Publisher, Subjects, TicketCreatedEvent } from '@prticketingms/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
