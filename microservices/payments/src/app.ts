import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import {json} from "body-parser";
import {currentUser, errorHandler, NotFoundError} from "@cpticketing/common-utils";
import {createChargeRouter} from "./routes/create";

const app = express()
// this is because we have ingress nginx as a proxy.
// In other words it tells express to trust traffic
// as being secure even though it is coming from a proxy
app.set('trust proxy', 1)
app.use(json())
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test', // have it `true` for every environment except test

}))
app.use(currentUser)
app.use(createChargeRouter)

app.get('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler)


export {app}