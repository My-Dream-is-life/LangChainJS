import dotenv from "dotenv";

dotenv.config();

const config = {
  apiKey: process.env.OPENAI_API_KEY,
  baseUrl: process.env.BASE_URL,
  Model: process.env.MODEL,
};

export default config;
