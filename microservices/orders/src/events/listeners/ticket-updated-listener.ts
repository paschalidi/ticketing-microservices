import {Listener} from "@cpticketing/common-utils/build/events/base-listener";
import {EventTicketUpdated, Subjects} from "@cpticketing/common-utils";
import {Message} from "node-nats-streaming";
import {queueGroupName} from "./queue-group-name";
import {Ticket} from "../../models/ticket";

export class TicketUpdatedListener extends Listener<EventTicketUpdated> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName

  async onMessage(data: EventTicketUpdated["data"], msg: Message) {
    const {title, price, id, version} = data
    const ticket = await Ticket.findByEvent({id, version})

    if (!ticket) {
      throw new Error('Ticket not found')
    }

    await ticket
      .set({title, price})
      .save()

    msg.ack();
  }
}