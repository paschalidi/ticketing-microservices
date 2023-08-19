import express, {Request, Response} from "express";
import {NotAuthorizedError, NotFoundError, requireAuth, validateRequest} from "@cpticketing/common-utils";
import {param} from "express-validator";
import {Order, OrderStatus} from "../models/order";

const router = express.Router();

router.delete(
  "/api/order/:orderId",
  requireAuth,
  [
    param('orderId')
      .isMongoId()
      .withMessage('orderId must be a valid mongoId')
  ],
  validateRequest,
  async (req: Request<{ orderId: string }>, res: Response) => {
    const {orderId} = req.params
    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();

    res.send(order);
  })

export {router as deleteOrderRouter};