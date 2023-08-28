import {Listener} from "@cpticketing/common-utils/build/events/base-listener";
import {EventExpirationComplete, Subjects} from "@cpticketing/common-utils";
import {Message} from "node-nats-streaming";
import {queueGroupName} from "./queue-group-name";
import {Order, OrderStatus} from "../../models/order";
import {OrderCancelledPublisher} from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<EventExpirationComplete> {
  readonly subject = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName

  async onMessage(data: EventExpirationComplete["data"], msg: Message) {
    const {orderId} = data
    const order = await Order
      .findById(orderId)
      .populate('ticket')


    if (!order) {
      throw new Error('Order not found')
    }
    if (order.status === OrderStatus.Complete) {
      return msg.ack()
    }

    await order
      .set({status: OrderStatus.Cancelled}) // now the isReserved will be false
      .save()

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id
      }
    })

    msg.ack();
  }
}