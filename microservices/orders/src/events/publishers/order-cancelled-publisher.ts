import {EventOrderCancelled, Publisher, Subjects} from "@cpticketing/common-utils";

export class OrderCancelledPublisher extends Publisher<EventOrderCancelled> {
  readonly subject = Subjects.OrderCancelled;
}
