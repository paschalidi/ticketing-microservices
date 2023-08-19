import request from 'supertest';
import {app} from "../../app";
import mongoose from "mongoose";
import {createOrder} from "./utils";

describe('Retrieve single order for the correct user', () => {
  it('should fetch the order ', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString()
    const {body: order} = await createOrder({userId, ticketTitle: 'concert', ticketPrice: 2009})

    const {body: singleOrder} = await request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie', global.signin({userId}))
      .send({})
      .expect(200)

    expect(singleOrder.id).toEqual(order.id)
  })
  it('should return 401 when user is trying to fetch an order that is not theirs', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString()
    const {body: order} = await createOrder({userId, ticketTitle: 'concert', ticketPrice: 2009})

    const wrongUserId = new mongoose.Types.ObjectId().toHexString()
    return request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie', global.signin({userId: wrongUserId}))
      .send({})
      .expect(401)

  })
});