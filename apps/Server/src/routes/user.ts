import * as dotenv from 'dotenv';
dotenv.config();

import { Router } from "express";
import { LoginSchema, SignupSchema } from "../types";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import  prisma  from '../utils/db';
export const userRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || "secret";

userRouter.post("/signup", async (req, res) => {
    const body = req.body;
    const parsedData = SignupSchema.safeParse(body);

    if (!parsedData.success) {
        return res.status(400).json({ error: "Invalid data" });
    }

    const userExist = await prisma.user.findFirst({
        where: {
            email: parsedData.data.email
        }
    });

    if (userExist) {
        return res.status(400).json({ msg: "User already exists" });
    } else {
        const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
        const user = await prisma.user.create({
            data: {
                name: parsedData.data.name || "",  
                email: parsedData.data.email,
                password: hashedPassword
            }
        });

        const token = jwt.sign(
            {
                email: user.email,
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token);
        return res.status(200).json({ msg: "User created successfully" });
    }
});

userRouter.post("/login", async (req, res) => {
    const body = req.body;
    const parsedData = LoginSchema.safeParse(body);

    if (!parsedData.success) {
        return res.status(400).json({ error: "Invalid data" });
    }

    const user = await prisma.user.findFirst({
        where: {
            email: parsedData.data.email,
        }
    });

    if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
    } else {
        const isPasswordValid = await bcrypt.compare(parsedData.data.password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ msg: "Invalid credentials" });
        } else {
            const token = jwt.sign(
                {
                    email: parsedData.data.email,
                },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.cookie('token', token);
            return res.status(200).json({ msg : "login successful" , name : user.name});
        }
    }
});
