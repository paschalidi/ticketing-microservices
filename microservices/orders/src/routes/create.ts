import express, {Request, Response} from "express";
import {requireAuth, validateRequest} from "@cpticketing/common-utils"
import {Order} from "../models/Order";

const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [],
  validateRequest,
  async (req: Request, res: Response) => {

    const order = Order.build({})
    await order.save();

    res.status(201).send(order);
  })

export {router as createOrderRouter};