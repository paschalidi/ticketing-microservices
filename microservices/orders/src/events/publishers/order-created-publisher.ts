import {EventOrderCreated, Publisher, Subjects} from "@cpticketing/common-utils";

export class OrderCreatedPublisher extends Publisher<EventOrderCreated> {
  readonly subject = Subjects.OrderCreated;
}
