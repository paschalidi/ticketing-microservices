import {Publisher, Subjects, TicketCreatedEvent} from "@cpticketing/common-utils";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}