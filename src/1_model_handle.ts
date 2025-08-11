import { model, errorModel } from "../config/model.js";
import { HumanMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";

/**
 * invoke: 基础调用，需要传入参数
 * 直接使用OpenAI的invoke接口，会直接返回一个结构体对象
 *
 * const response = await model.invoke([
 *   new HumanMessage("讲一个关于人工智能的笑话"),
 * ]);
 * console.log("invoke chat:", response.content);
 *
 * StringOutputParser类会将OpenAI返回的结构体提取出核心字符串(.content)
 * pipe方法可以组装多个Runnable对象，形成一个完整Chain
 *
 * const outputPrase = new StringOutputParser();
 * const simpleChain = model.pipe(outputPrase);
 * const response = await simpleChain.invoke([
 *   new HumanMessage("tell me a joke"),
 * ]);
 * console.log("invoke chat:", response);
 */

/**
 * batch: 批量调用，需要传入一组参数
 * 使用StringOutputParser类直接返回关键字符串
 *
 * const outputPrase = new StringOutputParser();
 * const simpleChain = model.pipe(outputPrase);
 * const response = await simpleChain.batch([
 *   [new HumanMessage("what is your name?")],
 *   [new HumanMessage("what is your age?")],
 * ]);
 * console.log("batch chat:", response);
 */

/**
 * stream: 流式调用，以Stream流的方式返回数据
 *
 * const outputPrase = new StringOutputParser();
 * const simpleChain = model.pipe(outputPrase);
 * const response = await simpleChain.stream([new HumanMessage("Hi!")]);
 * for await (const message of response) {
 *   console.log("stream chat:", message);
 * }
 */

/**
 * streamLog: 除了像Stream流一样返回数据，还会返回中间的运行结果
 *
 * const outputPrase = new StringOutputParser();
 * const simpleChain = model.pipe(outputPrase);
 * const response = await simpleChain.streamLog([new HumanMessage("Hi!")]);
 * for await (const message of response) {
 *   console.log("streamLog chat:", message);
 * }
 */

/**
 * withFallbacks: 当存在故障点(如LLM API问题、模型输出问题等)时可以进行优雅回退，避免程序崩溃
 * 步骤:
 *    1、先创建一个失败LLM并执行
 *    2、再创建一个成功LLM并设置fallback
 *    3、输出结果并打印结果
 *
 * const outputPrase = new StringOutputParser();
 * const simpleFailChain = errorModel.pipe(outputPrase);
 * await simpleFailChain.invoke([
 *   new HumanMessage("Hi, tell me first!"),
 * ]);
 * const simpleSuccessChain = model.pipe(outputPrase);
 * const llmWithFallback = simpleSuccessChain.withFallbacks({
 *   fallbacks: [simpleSuccessChain],
 * });
 * const successResponse = await llmWithFallback.invoke([
 *   new HumanMessage("Hi, tell me second!"),
 * ]);
 * console.log("fallback chat:", successResponse);
 */
