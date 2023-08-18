import express, {Request, Response} from "express";
import {NotFoundError} from "@cpticketing/common-utils";
import {Order} from "../models/Order";

const router = express.Router();

router.get(
    "/api/orders/:orderId",
    async (req: Request, res: Response) => {
        const ticket = await Order.findById(req.params.orderId);

        if (!ticket) {
            throw new NotFoundError();
        }

        res.send(ticket);
    })

export {router as retrieveOneOrderRouter};