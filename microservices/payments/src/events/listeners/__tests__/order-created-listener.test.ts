import {OrderCreatedListener} from "../order-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {EventOrderCreated, OrderStatus} from "@cpticketing/common-utils";
import mongoose from "mongoose";
import {Message} from "node-nats-streaming";
import {Order} from "../../../models/order";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const id = new mongoose.Types.ObjectId().toHexString();
  const userId = new mongoose.Types.ObjectId().toHexString();

  const data: EventOrderCreated['data'] = {
    id,
    version: 0,
    status: OrderStatus.Created,
    userId,
    ticket: {
      id: "123123",
      price: 1000
    },
    expiresAt: new Date().toISOString()
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return {listener, data, msg}
}

describe('Order created listener', () => {
  it('should replicate the order info', async () => {
    const {listener, data, msg} = await setup();
    await listener.onMessage(data, msg);


    const newOrder = await Order.findById(data.id);

    expect(newOrder!.id).toEqual(data.id);
    expect(newOrder!.price).toEqual(data.ticket.price);
  });
  it('should ack the message', async () => {
    const {listener, data, msg} = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalledTimes(1);
  });
})