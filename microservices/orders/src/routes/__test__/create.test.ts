import request from 'supertest';
import {app} from "../../app";
import {Order, OrderStatus} from "../../models/order";
import {Ticket} from "../../models/ticket";
import mongoose from "mongoose";

describe('New order creation', () => {
  it('should return an error if the ticker does not exist', async () => {
    const ticketId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ticketId})
      .expect(404)
  });

  it('should return an error if the ticket is already reserved', async () => {
    const ticket = Ticket.build({
      title: 'concert',
      price: 2009
    })
    await ticket.save();

    const order = Order.build({
      ticket,
      status: OrderStatus.Created,
      userId: '123',
      expiredAt: new Date()
    })
    await order.save()

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ticketId: ticket.id})
      .expect(409)
  });
  it('should reserve a ticket successfully', async () => {
    const ticket = Ticket.build({
      title: 'concert',
      price: 2009
    })
    await ticket.save();

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ticketId: ticket.id})
      .expect(201)
  });
  it.todo('emits an order created event');
});