import request from 'supertest';
import {app} from "../../app";
import mongoose from "mongoose";

describe('Retrieve single ticket', () => {
  it('should return 404 if ticket has not been found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
      .get(`/api/tickets/${id}`)
      .send()
      .expect(404);
  })

  it('should return the ticket when its found', async () => {
    const title = 'Test title';
    const price = 200;

    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title,
        price
      })
      .expect(201);

    const ticketResponse = await request(app)
      .get(`/api/tickets/${response.body.id}`)
      .send()
      .expect(200)

    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
  });
});