import mongoose from "mongoose";
import {PasswordManager} from "../utils/password-manager";

//an interface that describes the properties
//that are required to create a new Ticket. INPUT
interface UserAttrs {
    email: string;
    password: string;
}

// an interface that describes the properties
// that a Ticket Document has. This after the user is created and saved in the database.
// the difference is that we could add few extra properties to the document if our use case requires it. O
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

// an interface that describes the properties
// that a Ticket Model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc
}

const userSchema = new mongoose.Schema({
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id
                delete ret._id
                delete ret.password
                delete ret.__v
            }
        }
    })


// ** IMPORTANT **
// using function here is IMPORTANT because we need to use the `this` keyword
// and arrow function will not work because it will change the context of the `this` keyword
// to the context of the file and not the context of the function
userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashedPassword = await PasswordManager.toHash(this.get('password'))
        this.set('password', hashedPassword)
    }

    done()
})

// we are getting a custom function build in to the model
userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs)
}

export const User = mongoose.model<UserDoc, UserModel>('User', userSchema)
