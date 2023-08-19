import express, {Request, Response} from "express";
import {body} from "express-validator";
import {User} from "../models/user";
import {BadRequestError, validateRequest} from "@cpticketing/common-utils";
import {PasswordManager} from "../utils/password-manager";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/api/users/signin", [
    body("email")
      .isEmail()
      .withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password must be supplied"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // check if the user exists
    const {email} = req.body;
    const existingUser = await User.findOne({email})
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials")
    }

    // compare the hashed password
    const {password} = req.body;
    const passwordsMatch = await PasswordManager.compare(existingUser.password, password)
    if (!passwordsMatch) {
      throw new BadRequestError("Invalid credentials")
    }

    // Generate JWT
    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
      },
      process.env.JWT_SECRET_KEY!
    )

    // Store it on session object
    req.session = {
      jwt: userJwt
    }

    res.status(200).send(existingUser)
  })

export {router as signInRouter};