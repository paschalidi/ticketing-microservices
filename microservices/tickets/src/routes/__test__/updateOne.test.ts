import request from 'supertest';
import {app} from "../../app";
import mongoose from "mongoose";
import {natsWrapper} from "../../nats-wrapper";
import {Subjects} from "@cpticketing/common-utils";

describe('Update info from one ticket', () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  it('should return a 404 if the provided id does not exist', async () => {
    const title = 'valid title';
    const price = 202.250;

    await request(app)
      .put(`/api/tickets/${ticketId}`)
      .set('Cookie', global.signin())
      .send({title, price})
      .expect(404)
  });

  it('should return a 401 if the user is not authenticated', async () => {
    const title = 'valid title';
    const price = 202.250;
    await request(app)
      .put(`/api/tickets/${ticketId}`)
      .send({title, price})
      .expect(401)
  });

  it('should return a 401 if the user does not own the ticket', async () => {
    // create new ticket with user
    const userIdOfCreator = new mongoose.Types.ObjectId().toHexString()
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin({userId: userIdOfCreator}))
      .send({title: 'Original price title', price: 1000})
      .expect(201);

    // try to update the ticket with a different user
    const userIdOfUnauthorizedUser = new mongoose.Types.ObjectId().toHexString()
    const newTitle = 'VERY NEW TITLE';
    const newPrice = 202.250;
    const updatedTicket = await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', global.signin({userId: userIdOfUnauthorizedUser}))
      .send({title: newTitle, price: newPrice})
      .expect(401)
  });

  it('should return a 400 if the user provides invalid title or price', async () => {
    // create new ticket with user
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({title: 'Original price title', price: 1000})
      .expect(201);

    // attempt update with invalid title
    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', global.signin())
      .send({title: '', price: 100})
      .expect(400)

    // attempt update with invalid price
    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', global.signin())
      .send({title: 'Valid', price: -100})
      .expect(400)
  });

  it('should update the ticket provided valid inputs', async () => {
    // create new ticket with user
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({title: 'Original price title', price: 1000})
      .expect(201);

    const newTitle = 'VERY NEW TITLE';
    const newPrice = 2000;
    const updatedTicket = await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', global.signin())
      .send({title: newTitle, price: newPrice})
      .expect(200)

    const {title, price} = updatedTicket.body;

    expect(title).toEqual(newTitle);
    expect(price).toEqual(newPrice);
  });


  it('should call publisher when one events is updates', async () => {
    // create new ticket with user
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({title: 'Original price title', price: 1000})
      .expect(201);
    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1)

    const updatedTicket = await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', global.signin())
      .send({title: "UPDATED", price: 123123})
      .expect(200)

    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2)

    expect(natsWrapper.client.publish)
      .toHaveBeenCalledWith(
        Subjects.TicketCreated,
        expect.any(String),
        expect.any(Function)
      )
    expect(natsWrapper.client.publish)
      .toHaveBeenCalledWith(
        Subjects.TicketUpdated,
        expect.any(String),
        expect.any(Function)
      )
  });
});