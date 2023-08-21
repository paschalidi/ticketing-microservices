import {EventOrderCancelled, EventOrderCreated, Subjects} from "@cpticketing/common-utils";
import {Listener} from "@cpticketing/common-utils/build/events/base-listener";
import {queueGroupName} from "./queue-group-name";
import {Ticket} from "../../models/ticket";
import {TicketUpdatedPublisher} from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<EventOrderCancelled> {
  readonly subject = Subjects.OrderCancelled;

  queueGroupName = queueGroupName;

  async onMessage(data: EventOrderCancelled["data"], msg: any) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error('Ticket not found')
    }

    await ticket
      .set({orderId: undefined})
      .save();

    await new TicketUpdatedPublisher(this.client).publish({
      orderId: undefined,
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId
    })

    msg.ack();
  }
}