import { config } from "dotenv";

config();

export const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;
