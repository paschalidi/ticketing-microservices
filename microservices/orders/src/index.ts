import mongoose from 'mongoose';
import {logger} from "./logger";
import {app} from "./app";
import {natsWrapper} from "./nats-wrapper";

const start = async () => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error('JWT_SECRET_KEY must be defined')
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined')
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined')
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined')
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined')
  }

  try {
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL)
    natsWrapper.client.on('close', () => {
      logger.info('NATS connection closed!');
      process.exit();
    });
    // process.on('SIGINT', () => natsWrapper.client.close());
    // process.on('SIGTERM', () => natsWrapper.client.close());
    //

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
