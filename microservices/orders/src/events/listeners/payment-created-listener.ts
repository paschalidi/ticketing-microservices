import {Listener, Subjects, EventPaymentCreated, OrderStatus} from "@cpticketing/common-utils"
import {queueGroupName} from "./queue-group-name";
import {Order} from "../../models/order";

export class PaymentCreatedListener extends Listener<EventPaymentCreated>{
  readonly subject = Subjects.PaymentCreated
  queueGroupName = queueGroupName
  async onMessage(data: EventPaymentCreated['data'], msg: any) {
    const order = await Order.findById(data.orderId)

    if (!order) {
      throw new Error('Order not found')
    }

    order.set({status: OrderStatus.Complete})
    await order.save()

    msg.ack()
  }
}