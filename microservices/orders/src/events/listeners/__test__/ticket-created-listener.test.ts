import {TicketCreatedListener} from "../ticket-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import mongoose from "mongoose";
import {EventTicketCreated} from "@cpticketing/common-utils";
import {Message} from "node-nats-streaming";
import {Ticket} from "../../../models/ticket";

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);
  const data: EventTicketCreated['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0
  }
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return {listener, data, msg}
}
describe('Ticket Created Listener', () => {
  it('should create and save a ticket', async () => {
    const {listener, data, msg} = await setup();

    await listener.onMessage(data, msg);
    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
    expect(ticket!.version).toEqual(data.version);

  });
  it('should ack the message', async () => {
    const {listener, data, msg} = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalledTimes(1);
  });
})