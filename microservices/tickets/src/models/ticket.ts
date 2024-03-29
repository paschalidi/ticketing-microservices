import mongoose from "mongoose";
// import {updateIfCurrentPlugin} from 'mongoose-update-if-current';

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
  version: number;
  title: string;
  price: number;
  userId: string;
  orderId?: string;
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
    },
    orderId: {
      type: String,
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

ticketSchema.set('versionKey', 'version');
ticketSchema.pre('save', function (next) {
  this.increment(); // Increment the version if the document has been modified
  next();
});

// we are getting a custom function build in to the model
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs)
}

export const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)
