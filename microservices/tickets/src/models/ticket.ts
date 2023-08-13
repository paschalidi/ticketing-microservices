import mongoose from "mongoose";

//an interface that describes the properties
//that are required to create a new Ticket. INPUT
interface TicketAttrs {
    title: string;
    price: number;
    userId: string;
}

// an interface that describes the properties
// that a Ticket Document has. This after the user is created. OUTPUT
interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
}

// an interface that describes the properties
// that a Ticket Model has
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc
}

const ticketSchema = new mongoose.Schema({
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
ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs)
}

export const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)
