import express, {Request, Response} from "express";
import {NotFoundError} from "@cpticketing/common-utils";
import {Order} from "../models/Order";

const router = express.Router();

router.get(
    "/api/orders",
    async (req: Request, res: Response) => {
        const orders = await Order.find({});
        if (!orders) {
            throw new NotFoundError();
        }

        res.send(orders);
    })

export {router as retrieveAllOrdersRouter};