import request from 'supertest';
import {app} from "../../app";
import mongoose from "mongoose";
import {createOrder} from "./utils";
import {OrderStatus} from "../../models/order";
import {Subjects} from "@cpticketing/common-utils";
import {natsWrapper} from "../../nats-wrapper";

describe('Changes the status of the ticket when the user request to delete it', () => {
  it('should give 404 when orderId not found', async () => {
    const orderId = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .delete(`/api/order/${orderId}`)
      .set('Cookie', global.signin())
      .send({})
      .expect(404)
  });

  it('should give 401 when user tries to delete an order that is not theirs', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const {body: order} = await createOrder({userId, ticketTitle: 'concert', ticketPrice: 2009})

    return request(app)
      .delete(`/api/order/${order.id}`)
      .set('Cookie', global.signin({userId: new mongoose.Types.ObjectId().toHexString()}))
      .send()
      .expect(401)
  });

  it('should return the changed order with status canceled', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const {body: order} = await createOrder({userId, ticketTitle: 'concert', ticketPrice: 2009})

    const {body: updatedOrder} = await request(app)
      .delete(`/api/order/${order.id}`)
      .set('Cookie', global.signin({userId}))
      .send()
      .expect(200)

    expect(updatedOrder.status).toEqual(OrderStatus.Cancelled)
  });


  it('emits an order delete event', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const {body: order} = await createOrder({userId, ticketTitle: 'concert', ticketPrice: 2009})

    await request(app)
      .delete(`/api/order/${order.id}`)
      .set('Cookie', global.signin({userId}))
      .send()
      .expect(200)

    expect(natsWrapper.client.publish)
      .toHaveBeenCalledWith(
        Subjects.OrderCancelled,
        expect.any(String),
        expect.any(Function)
      )
  });
});