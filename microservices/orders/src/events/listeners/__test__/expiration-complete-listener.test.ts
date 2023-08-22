import {natsWrapper} from "../../../nats-wrapper";
import mongoose from "mongoose";
import {Message} from "node-nats-streaming";
import {Ticket} from "../../../models/ticket";
import {EventExpirationComplete} from "@cpticketing/common-utils";
import {ExpirationCompleteListener} from "../expiration-complete-listener";
import {Order, OrderStatus} from "../../../models/order";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticketId = new mongoose.Types.ObjectId().toHexString()
  const ticket = await Ticket
    .build({
      title: 'concert',
      price: 20,
      id: ticketId
    })
    .save()

  const order = await Order
    .build({
      status: OrderStatus.Created,
      userId: new mongoose.Types.ObjectId().toHexString(),
      ticket,
      expiredAt: new Date()
    })
    .save()

  const data: EventExpirationComplete['data'] = {
    orderId: order.id
  }

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return {listener, data, msg, ticket, order}
}


describe('Expiration complete listener', () => {
  it('should update the order status to cancelled', async () => {
    const {listener, data, msg, ticket,order} = await setup();
    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  });
  it('should emmit an OrderCancelled event', async () => {
    const {listener, data, msg, ticket,order} = await setup();
    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);
    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(eventData.id).toEqual(order.id);
  });
  it('should ack the message', async () => {
    const {listener, data, msg, ticket,order} = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalledTimes(1);
  });
})