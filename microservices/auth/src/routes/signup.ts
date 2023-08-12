import express, {Request, Response} from "express";
import {body} from "express-validator";
import {User} from "../models/user";
import jwt from "jsonwebtoken";
import {BadRequestError, validateRequest} from "@cpticketing/common-utils";

const router = express.Router();

interface Body {
    email: string;
    password: string;
}

router.post(
    "/api/users/signup",
    [
        body("email")
            .isEmail()
            .withMessage("Email must be valid"),
        body("password")
            .trim()
            .isStrongPassword({
                minLength: 4,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 4,
            })
            .withMessage("Password must be between 4 and 20 characters and also strong")
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {email, password}: Body = req.body;
        const existingUser = await User.findOne({email})
        if (existingUser) {
            throw new BadRequestError("The email provided is already in use. Please choose a different one.")
        }
        const user = User.build({email, password})
        await user.save()

        // Generate JWT
        const userJwt = jwt.sign({
                id: user.id,
                email: user.email
            },
            // the ! tells typescript that we are
            // sure that the variable is defined
            process.env.JWT_SECRET_KEY!
        )

        // Store it on session object
        req.session = {
            jwt: userJwt
        }

        res.status(201).send(user)
    })

export {router as signUpRouter};