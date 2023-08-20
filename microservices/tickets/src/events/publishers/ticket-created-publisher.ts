import {Publisher, Subjects, EventTicketCreated} from "@cpticketing/common-utils";

export class TicketCreatedPublisher extends Publisher<EventTicketCreated> {
  readonly subject = Subjects.TicketCreated;
}