import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@prticketingms/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
