import dotenv from 'dotenv';

dotenv.config();

export const REV_AI_TOKEN = process.env.REV_AI_TOKEN;
export const PORT = process.env.PORT || 3000;
