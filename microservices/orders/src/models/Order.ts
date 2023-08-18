import mongoose from "mongoose";

//an interface that describes the properties
//that are required to create a new Order. INPUT
interface OrderAttrs {
    title: string;
    price: number;
    userId: string;
}

// an interface that describes the properties
// that a Order Document has. This after the user is created. OUTPUT
interface OrderDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
}

// an interface that describes the properties
// that a Order Model has
interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        userId: {
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


// we are getting a custom function build in to the model
orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs)
}

export const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)
