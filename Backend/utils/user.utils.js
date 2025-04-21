import jwt from "jsonwebtoken";
import { Redis } from "../lib/redis.js"
import dotenv from "dotenv";
dotenv.config();

export const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "7d"
    })

    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "30d"
    })

    return { accessToken, refreshToken }
}

export const setCookies = (accessToken, refreshToken, res) => {
    res.cookie("access_token", accessToken, {
        secure: false,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.cookie("refresh_token", refreshToken, {
        secure: false,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    })
}

export const storeRefreshToken = async (refreshToken, userId) => {
    await Redis.set(`refresh_token:${userId}`, refreshToken, "EX", 30 * 24 * 60 * 60 * 1000);
}