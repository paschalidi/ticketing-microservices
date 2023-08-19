import request from 'supertest';
import {app} from "../../app";
import mongoose from "mongoose";
import {createOrder} from "./utils";

describe('Retrieve all orders', () => {
  it.only('should return all the orders for the user who made the request', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString()
    await createOrder({userId, ticketTitle: 'concert', ticketPrice: 2009})
    await createOrder({userId, ticketTitle: 'happy metal', ticketPrice: 2009})
    await createOrder({userId, ticketTitle: 'very metal', ticketPrice: 100})
    const response = await request(app)
      .get('/api/orders')
      .set('Cookie', global.signin({userId}))
      .send({})
      .expect(200)
    expect(response.body.length).toEqual(3)

    const userId2 = new mongoose.Types.ObjectId().toHexString()
    await createOrder({userId: userId2, ticketTitle: 'hallow', ticketPrice: 2009})
    await createOrder({userId: userId2, ticketTitle: 'wheen', ticketPrice: 2009})

    const response2 = await request(app)
      .get('/api/orders')
      .set('Cookie', global.signin({userId: userId2}))
      .send({})
      .expect(200)
    expect(response2.body.length).toEqual(2)
  })
});
