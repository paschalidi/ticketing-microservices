import express, {Request, Response} from "express";
import {Order} from "../models/order";
import {requireAuth} from "@cpticketing/common-utils";

const router = express.Router();

router.get(
  "/api/orders",
  requireAuth,
  async (req: Request, res: Response) => {
    const userId = req.currentUser!.id
    const orders = await Order
      .find({userId})
      .populate('ticket');

    res.send(orders);
  })

export {router as retrieveAllOrdersRouter};