import {EventExpirationComplete, Publisher, Subjects} from "@cpticketing/common-utils";

export class ExpirationCompletePublisher extends Publisher<EventExpirationComplete> {
  readonly subject = Subjects.ExpirationComplete;
}
