import express, {Request, Response} from "express";
import {BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest} from "@cpticketing/common-utils"
import {Ticket} from "../models/ticket";
import {Order} from "../models/order";
import {body} from "express-validator";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .withMessage("Valid ticketId must be provided"),
    body("ticketId")
      .isMongoId()
      .withMessage("ticketId must be a valid mongoId")
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {ticketId} = req.body;
    const ticket = await Ticket.findById(ticketId)
    if (!ticket) {
      throw new NotFoundError()
    }

    if (await ticket.isReserved()) {
      throw new BadRequestError('Ticket is already reserved')
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      ticket: ticket,
      expiredAt: expiration
    })
    await order.save();
    res.status(201).send(order);
  })

export {router as createOrderRouter};