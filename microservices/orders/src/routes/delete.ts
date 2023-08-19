import express, {Request, Response} from "express";
import {NotAuthorizedError, NotFoundError, requireAuth, validateRequest} from "@cpticketing/common-utils";
import {Order} from "../models/order";
import {body} from "express-validator";
import {natsWrapper} from "../nats-wrapper";

const router = express.Router();

router.delete(
    "/api/orders/:orderId",
    requireAuth,
    [],
    validateRequest,
    async (req: Request, res: Response) => {

    })

export {router as deleteOrderRouter};