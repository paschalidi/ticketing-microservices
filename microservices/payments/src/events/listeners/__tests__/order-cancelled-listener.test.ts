import {natsWrapper} from "../../../nats-wrapper";
import {EventOrderCancelled, OrderStatus} from "@cpticketing/common-utils";
import mongoose from "mongoose";
import {Message} from "node-nats-streaming";
import {OrderCancelledListener} from "../order-cancelled-listener";
import {Order} from "../../../models/order";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const id = new mongoose.Types.ObjectId().toHexString()
  const userId = new mongoose.Types.ObjectId().toHexString()
  const order = Order
    .build({
      id,
      price: 99,
      userId,
      version: 0,
      status: OrderStatus.Created
    })

  await order.save()

  const data: EventOrderCancelled['data'] = {
    id,
    version: 1,
    ticket: {
      id: 'ticket.id',
    }
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return {listener, order, data, msg}
}

describe('Order cancelled listener', () => {
  it('should set the orderStatus to cancelled', async () => {
    const {listener, order, data, msg} = await setup();
    await listener.onMessage(data, msg);

    const foundOrder = await Order.findById(data.id);
    expect(foundOrder!.status).toEqual(OrderStatus.Cancelled);
    expect(foundOrder!.version).toEqual(1);
  });
  it('should ack the message', async () => {
    const {listener, data, msg} = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalledTimes(1);
  });
})