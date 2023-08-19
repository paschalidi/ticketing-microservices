import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import {json} from "body-parser";
import {currentUser, errorHandler, NotFoundError} from "@cpticketing/common-utils";
import {createOrderRouter} from "./routes/create";
import {deleteOrderRouter} from "./routes/delete";
import {retrieveAllOrdersRouter} from "./routes/retrieveAll";
import {retrieveOneOrderRouter} from "./routes/retrieveOne";

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
app.use(createOrderRouter)
app.use(deleteOrderRouter)
app.use(retrieveAllOrdersRouter)
app.use(retrieveOneOrderRouter)

app.get('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler)


export {app}