import mongoose from "mongoose";
import {Order, OrderStatus} from "./order";


interface TicketAttrs {
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;

  isReserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc

  isReserved(): Promise<boolean>
}

const ticketSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      }
    }
  })


// we are getting a custom function build in to the model
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs)
}

// MUST always be a function not an arrow function
// because we need to use this
ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      // the value is in one of these statuses.
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
      ]
    }
  })
  return !!existingOrder
}

export const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

