import {natsWrapper} from "../../../nats-wrapper";
import mongoose from "mongoose";
import {Message} from "node-nats-streaming";
import {Ticket} from "../../../models/ticket";
import {TicketUpdatedListener} from "../ticket-updated-listener";
import {EventTicketUpdated} from "@cpticketing/common-utils";

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = await Ticket
    .build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: 'co cert',
      price: 20,
    })
    .save()

  const data: EventTicketUpdated['data'] = {
    id: ticket.id,
    title: 'VERY NEW!',
    price: 1444,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: ticket.version + 1
  }

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return {listener, data, msg, ticket}
}
describe('Ticket Updated Listener', () => {
  it('should find, update and save a ticket', async () => {
    const {listener, data, msg, ticket} = await setup();
    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket).toBeDefined();
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);

  });
  it('should ack the message', async () => {
    const {listener, data, msg} = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalledTimes(1);
  });
  it('should not call ack if the event has a skipped version number', async () => {
    const {listener, data, msg} = await setup();
    data.version = 10;

    await expect(async () => listener.onMessage(data, msg)).rejects.toThrow();
    expect(msg.ack).toHaveBeenCalledTimes(0);
  });
})