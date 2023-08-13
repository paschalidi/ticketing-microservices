import express, {Request, Response} from "express";
import {requireAuth, validateRequest} from "@cpticketing/common-utils";
import {body} from "express-validator";
import {Ticket} from "../models/ticket";

const router = express.Router();

router.post(
    "/api/tickets",
    requireAuth,
    [
        body("title")
            .isString()
            .not()
            .isEmpty()
            .withMessage("Title must be provided"),
        body("price")
            .isFloat({gt: 0})
            .withMessage("Price should be greater than 0"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {title, price} = req.body;

       const ticket = Ticket.build({
            title,
            price,
            userId: req.currentUser!.id // we got the user always defined since we are using the requireAuth middleware
        })
        await ticket.save();

        res.status(201).send(ticket);
    })

export {router as createTicketRouter};