import {Listener} from "@cpticketing/common-utils/build/events/base-listener";
import {EventTicketCreated, Subjects} from "@cpticketing/common-utils";
import {Message} from "node-nats-streaming";
import {queueGroupName} from "./queue-group-name";
import {Ticket} from "../../models/ticket";

export class TicketCreatedListener extends Listener<EventTicketCreated> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName

  async onMessage(data: EventTicketCreated["data"], msg: Message) {
    const {title, price, id} = data
    const ticket = Ticket.build({title, price, id})
    await ticket.save();
    msg.ack();
  }
}