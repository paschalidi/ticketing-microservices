import {EventOrderCreated, Subjects} from "@cpticketing/common-utils";
import {Listener} from "@cpticketing/common-utils/build/events/base-listener";
import {queueGroupName} from "./queue-group-name";
import {Message} from "node-nats-streaming";
import {Order} from "../../models/order";

export class OrderCreatedListener extends Listener<EventOrderCreated> {
  readonly subject = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: EventOrderCreated["data"], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version
    });
    await order.save();

    msg.ack();
  }
}