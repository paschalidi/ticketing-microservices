import {EventOrderCreated, Subjects} from "@cpticketing/common-utils";
import {Listener} from "@cpticketing/common-utils/build/events/base-listener";
import {queueGroupName} from "./queue-group-name";
import {Ticket} from "../../models/ticket";
import {TicketUpdatedPublisher} from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<EventOrderCreated> {
  readonly subject = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: EventOrderCreated["data"], msg: any) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error('Ticket not found')
    }

    await ticket
      .set({orderId: data.id})
      .save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      orderId: data.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId
    })

    msg.ack();
  }
}