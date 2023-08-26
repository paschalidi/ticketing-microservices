import {EventOrderCancelled, OrderStatus, Subjects} from "@cpticketing/common-utils";
import {Listener} from "@cpticketing/common-utils/build/events/base-listener";
import {queueGroupName} from "./queue-group-name";
import {Order} from "../../models/order";

export class OrderCancelledListener extends Listener<EventOrderCancelled> {
  readonly subject = Subjects.OrderCancelled;

  queueGroupName = queueGroupName;

  async onMessage(data: EventOrderCancelled["data"], msg: any) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1
    });
    if (!order) {
      throw new Error('Order not found')
    }

    await order
      .set({status: OrderStatus.Cancelled})
      .save();

    msg.ack();
  }
}