import {EventTicketUpdated, Publisher, Subjects} from "@cpticketing/common-utils";

export class TicketUpdatedPublisher extends Publisher<EventTicketUpdated> {
  readonly subject = Subjects.TicketUpdated;
}