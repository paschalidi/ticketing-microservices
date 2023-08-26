import express, {Request, Response} from "express";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest
} from "@cpticketing/common-utils";
import {body} from "express-validator";
import {Order} from "../models/order";
import {stripe} from "../stripe";
import {Payment} from "../models/payment";


const router = express.Router()

router.post(
  '/api/payments',
  requireAuth,
  [
    body('token')
      .not()
      .isEmpty(),
    body('orderId')
      .not()
      .isEmpty(),
  ],
  validateRequest,
  async (req: Request<{ token: string, orderId: string }>, res: Response) => {

    const {token, orderId} = req.body

    const order = await Order.findById(orderId)
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for an cancelled order');
    }

    const {id: stripeId} = await stripe.charges.create({
      amount: order.price * 100,
      currency: 'usd',
      source: token,
      description: `Charge for order ${order.id}`
    })

    const payment = await Payment
      .build({orderId, stripeId})
      .save()

    res.status(201).send({success: true})
  }
)

export {router as createChargeRouter}