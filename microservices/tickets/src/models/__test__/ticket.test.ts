import {Ticket} from "../ticket";
import mongoose from "mongoose";


describe('Ticket Model', () => {
  it('should implement optimistic concurrency control', async () => {
    const userId = '123';
    const ticket = Ticket.build({
      title: 'concert',
      price: 5,
      userId
    })
    await ticket.save();


    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    firstInstance!.set({price: 10});
    secondInstance!.set({price: 15});

    await firstInstance!.save();
    await expect(async () => secondInstance!.save()).rejects.toThrow();
  })

  it('should increase the version number on multiple saves', async () => {
    const userId = '123';
    const ticket = Ticket.build({
      title: 'concert',
      price: 5,
      userId
    })
    await ticket.save();
    expect(ticket.version).toEqual(0);

    await ticket.save();
    expect(ticket.version).toEqual(1);

    await ticket.save();
    expect(ticket.version).toEqual(2);
  });
})