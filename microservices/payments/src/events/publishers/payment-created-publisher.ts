import {EventPaymentCreated, Publisher, Subjects} from "@cpticketing/common-utils";

export class PaymentCreatedPublisher extends Publisher<EventPaymentCreated> {
  readonly subject = Subjects.PaymentCreated;
}