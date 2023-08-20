import mongoose from "mongoose";
import {Order, OrderStatus} from "./order";


interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  version: number;
  title: string;
  price: number;

  isReserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc

  findByEvent(event: { id: string, version: number }): Promise<TicketDoc | null>
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

ticketSchema.set('versionKey', 'version');
ticketSchema.pre('save', function (next) {
  this.increment(); // Increment the version if the document has been modified
  next();
});


// we are getting a custom function build in to the model
ticketSchema.statics.build = ({id: _id, ...restAttrs}: TicketAttrs) => {
  return new Ticket({_id, ...restAttrs})
}
ticketSchema.statics.findByEvent = async ({id, version}: { id: string, version: number }) => {
  return Ticket.findOne({_id: id, version: version - 1})
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

