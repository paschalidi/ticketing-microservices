import {app} from "../../app";
import request from 'supertest';
import mongoose from "mongoose";
import {Order} from "../../models/order";
import {OrderStatus} from "@cpticketing/common-utils";
import {stripe} from "../../stripe";
import {Payment} from "../../models/payment";

describe('New payment', () => {
  it('should throw a 404 if tries to purchase an order that doesnt exist', async () => {
    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin())
      .send({token: '123456789', orderId: new mongoose.Types.ObjectId().toHexString(),})
      .expect(404)
  });

  it('should return 401 for _not_ authenticated users', async () => {
    await request(app)
      .post('/api/payments')
      .send({token: '123456789', orderId: new mongoose.Types.ObjectId().toHexString(),})
      .expect(401)
  });

  it('should return 401 when tries to purchase an order that doesnt belong to the user ', async () => {
    const order = await Order
      .build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.Created
      })
      .save()
    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin())
      .send({token: '123456789', orderId: order.id})
      .expect(401)
  });

  it('should return 409 when tries to purchase an is cancelled', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString()
    const order = await Order
      .build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price: 20,
        status: OrderStatus.Cancelled
      })
      .save()
    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin({userId}))
      .send({token: 'tok_visa', orderId: order.id})
      .expect(409)
  });


  it.only('should return a 201 with valid inputs', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString()
    const price = Math.floor(Math.random() * 100000)
    const order = await Order
      .build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price,
        status: OrderStatus.Created
      })
      .save()
    const hello= await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin({userId}))
      .send({token: 'tok_visa', orderId: order.id})
    const charges = await stripe.charges.list({limit: 10})

    const charge = charges.data.find(charge => charge.amount === price * 100)
    expect(charge).toBeDefined()
    expect(charge!.currency).toBe('usd')

    const payment = await Payment.findOne({orderId: order.id, stripeId: charge!.id})

    expect(payment).not.toBeNull()
  });


});