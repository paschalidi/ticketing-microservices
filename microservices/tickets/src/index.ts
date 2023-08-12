import mongoose from 'mongoose';
import {logger} from "./logger";
import {app} from "./app";

const start = async () => {
    if (!process.env.JWT_SECRET_KEY) {
        throw new Error('JWT_SECRET_KEY must be defined')
    }
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined')
    }

    try {
        await mongoose.connect(process.env.MONGO_URI)
        logger.info('Connected to MongoDB for tickets!');

    } catch (err) {
        logger.error(err);
    }

    app.listen(3000, async () => {
        logger.info('Listening on port 3000')
    })
}

(() => start())()
