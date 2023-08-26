import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  var signin: ({userId}?: { userId: string }) => string[];
}

jest.mock('../nats-wrapper');


let mongo: any;
process.env.STRIPE_KEY_TEST = 'sk_test_51NagNsHxHL1ILxGLVCzLI7DsmaaqGtGzGcxPvZWLdiygfj2UzJ9mrdtJfrEQMdD678yXcdU1URTp7U4nE6va8zja005o6tfHmE';
beforeAll(async () => {
  process.env.JWT_SECRET_KEY = 'some_secret_key';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  const mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = ({userId} = {userId: '123123'}) => {
  // Build a JWT payload.  { id, email }
  const payload = {
    id: userId,
    email: 'test@test.com'
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!);

  // Build session Object. { jwt: MY_JWT }
  const session = {jwt: token};

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string that's the cookie with the encoded data
  return [`session=${base64}`];
};
