import mongoose from "mongoose";
import {OrderStatus} from "@cpticketing/common-utils";

//an interface that describes the properties
//that are required to create a new Order. INPUT
interface OrderAttrs {
  id: string;
  userId: string;
  version: number;
  status: OrderStatus
  price: number;
}

// an interface that describes the properties
// that an Order Document has. This after the user is created. OUTPUT
interface OrderDoc extends mongoose.Document {
  userId: string;
  version: number;
  status: OrderStatus
  price: number;
}

// an interface that describes the properties
// that an Order Model has
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new mongoose.Schema({
    price: {
      type: Number,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
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
  return new Order({
    _id: attrs.id,
    ...attrs
  })
}

export const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)
