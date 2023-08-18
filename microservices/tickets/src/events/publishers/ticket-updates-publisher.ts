import {Publisher, Subjects, TicketUpdatedEvent} from "@cpticketing/common-utils";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}