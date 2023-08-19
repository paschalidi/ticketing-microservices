import {Ticket} from "../../models/ticket";
import request from "supertest";
import {app} from "../../app";

export const createOrder = async ({userId, ticketTitle, ticketPrice}: {
  ticketTitle: string,
  ticketPrice: number,
  userId: string
}) => {
  const ticket = Ticket.build({
    title: ticketTitle,
    price: ticketPrice
  })
  await ticket.save();

  return request(app)
    .post('/api/orders')
    .set('Cookie', global.signin({userId}))
    .send({ticketId: ticket.id})
    .expect(201)
}
