import mongoose from "mongoose";
import {OrderStatus} from "@cpticketing/common-utils";
import {TicketDoc} from "./ticket";

export {OrderStatus}

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiredAt: Date;
  ticket: TicketDoc
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiredAt: Date;
  ticket: TicketDoc
  version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new mongoose.Schema({
    userId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created
    },
    expiredAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket'
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      }
    }
  })


orderSchema.set('versionKey', 'version');
orderSchema.pre('save', function (next) {
  this.increment(); // Increment the version if the document has been modified
  next();
});

// we are getting a custom function build in to the model
orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs)
}

export const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)
