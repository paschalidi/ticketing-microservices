import express, {Request, Response} from "express";
import {NotAuthorizedError, NotFoundError, requireAuth, validateRequest} from "@cpticketing/common-utils";
import {Ticket} from "../models/ticket";
import {body} from "express-validator";

const router = express.Router();

router.put(
    "/api/tickets/:id",
    requireAuth,
    [
        body('title')
            .not()
            .isEmpty()
            .withMessage('Title is required'),
        body('price')
            .isFloat({gt: 0})
            .withMessage('Price must be provided and must be greater than 0'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {id: ticketIdFromParam} = req.params;
        const ticket = await Ticket.findById(ticketIdFromParam);
        if (!ticket) {
            throw new NotFoundError();
        }
        if (ticket.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        ticket.set({
            title: req.body.title,
            price: req.body.price,
        });
        await ticket.save();

        res.send(ticket);
    })

export {router as updateOneTicketRouter};