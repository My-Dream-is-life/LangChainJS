import config from "./dotenv.js";
import { ChatOpenAI } from "@langchain/openai";

/**
 * 模型定义及相关配置
 */
const model = new ChatOpenAI({
  model: config.Model,
  apiKey: config.apiKey,
  configuration: {
    baseURL: config.baseUrl,
  },
  temperature: 0.7,
});

/**
 * 错误模型定义及相关配置（添加重试次数参数）
 */
const errorModel = new ChatOpenAI({
  model: config.Model,
  apiKey: config.apiKey,
  configuration: {
    baseURL: "",
  },
  maxRetries: 0,
});

export { model, errorModel };
