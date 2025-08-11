import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  PromptTemplate,
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  PipelinePromptTemplate,
} from "@langchain/core/prompts";
import { model } from "../config/model.js";

/**
 * 无变量基础Prompt Template
 * inputVariables字段为[]时为不传入任何变量，硬编码一个字符串
 *
 * const greetingPrompt = new PromptTemplate({
 *   inputVariables: [],
 *   template: "Hello, World!",
 * });
 * const formattedGreetingPrompt = await greetingPrompt.format({});
 * console.log("no variable prompt template:", formattedGreetingPrompt);
 */

/**
 * 有变量基础Prompt Template
 * inputVariables字段定义了变量之后，需在format方法中传入相关变量
 * 注意: Prompt中不需要转为变量的需要使用{{}}包裹
 *
 * const greetingPrompt = new PromptTemplate({
 *   inputVariables: ["timeOfDay", "name"],
 *   template: "good {timeOfDay}, {name}, {{test}}",
 * });
 * const formattedGreetingPrompt = await greetingPrompt.format({
 *   timeOfDay: "afternoon",
 *   name: "Jone",
 * });
 * console.log("has variable prompt template:", formattedGreetingPrompt);
 */

/**
 * 通过LangChain自带的fromTemplate方法来创建Prompt Template
 * 使用format方法添加参数并格式化template
 * 注意点: 无需使用inputVariables字段添加变量，能够自动推测出相关变量
 *
 * const autoInferPrompt = PromptTemplate.fromTemplate("good {timeOfDay}, {name}");
 * const formattedAutoInferPrompt = await autoInferPrompt.format({
 *   timeOfDay: "afternoon",
 *   name: "Jone",
 * });
 * console.log("auto infer prompt template:", formattedAutoInferPrompt);
 */

/**
 * 使用部分参数创建Prompt Template
 * 可以通过partial方法先获取一个参数，再通过format方法获取其他参数
 *
 * const initPrompt = PromptTemplate.fromTemplate("这是{type}种类，它是{item}");
 * const partialPrompt = await initPrompt.partial({ type: "猫科" });
 * const firstFormattedPrompt = await partialPrompt.format({ item: "老虎" });
 * console.log("first prompt template:", firstFormattedPrompt);
 * const secondFormattedPrompt = await partialPrompt.format({ item: "田园猫" });
 * console.log("second prompt template:", secondFormattedPrompt);
 */

/**
 * 使用动态填充参数
 *
 * const getCurrentDate = () => new Date().toLocaleDateString();
 * const getGreeting = (timePeriod: string) => {
 *   const date = getCurrentDate();
 *   switch (timePeriod) {
 *     case "早上":
 *       return date + " 早上好！";
 *     case "中午":
 *       return date + " 中午好！";
 *     case "晚上":
 *       return date + " 晚上好！";
 *     default:
 *       return date + " 你好！";
 *   }
 * };
 * const initDatePrompt = PromptTemplate.fromTemplate(
 *   "今天是{date}, {timePeriod}, {activity}"
 * );
 * const partialPrompt = await initDatePrompt.partial({ date: getCurrentDate });
 * const formattedPrompt = await partialPrompt.format({
 *   timePeriod: getGreeting("中午"),
 *   activity: "有时间出去玩吗？",
 * });
 * console.log("dynamic param prompt template:", formattedPrompt);
 */

/**
 * Chat Prompt是跟LLM交互的主要形式
 * ChatPromptTemplate: 对话信息，该类是最常用的工具
 * SystemMessagePromptTemplate: 通常用于设置对话的上下文或者指定模型采取特定的行为模式，存在很高的权重
 * AIMessagePromptTemplate: 是LLM根据system的指示和user的问题输入来生成的
 * HumanMessagePromptTemplate: 是真实用户在对话中的发言，反映的是用户的行为和意图
 * 步骤:
 *    1、需要先行构建一个系统指令来给LLM指定核心的准则
 *    2、再构建一个真实用户输入的指令
 *    3、随后通过ChatPromptTemplate类下的fromMessages方法组合两个信息，使其形成一个对话信息
 *    4、可以通过formatMessages方法来格式化对话信息打印显示其结构样式和相关指令说明
 *    5、通过StringOutputParser类提取模型关键字符串
 *    6、通过pipe方法创建一个完整Chain
 *    7、调用Chain来产生结果
 *
 * const systemInstructionPrompt = SystemMessagePromptTemplate.fromTemplate(
 *   "你是一个专业的翻译员，你的任务是将文本从{source_lang}翻译到{target_lang}。"
 * );
 * const userQuestionPrompt = HumanMessagePromptTemplate.fromTemplate(
 *   "麻烦请帮助我翻译这段文字: {text}"
 * );
 * const chatMessagePrompt = ChatPromptTemplate.fromMessages([
 *   systemInstructionPrompt,
 *   userQuestionPrompt,
 * ]);
 * const formattedChatMessagePrompt = await chatMessagePrompt.formatMessages({
 *   source_lang: "中文",
 *   target_lang: "日文",
 *   text: "你好，世界！",
 * });
 * console.log("translate prompt template", formattedChatMessagePrompt);
 * const outputParse = new StringOutputParser();
 * const simpleChain = model.pipe(outputParse);
 * const completedChatChain = chatMessagePrompt.pipe(simpleChain);
 * const translateResponse = await completedChatChain.invoke({
 *   source_lang: "中文",
 *   target_lang: "日文",
 *   text: "你好，世界！",
 * });
 * console.log("translate prompt template response", translateResponse);
 */

/**
 * 组合多个Prompt
 * 使用PipelinePromptTemplate类可以将多个独立的Prompt构造成一个完整且复杂的Prompt，提高复用性
 * 核心概念如下:
 *    1、pipelinePrompts: 一组Object，每一个Object都表示的是prompt运行之后赋值给对应name变量
 *    2、finalPrompt: 最终输出的Prompt
 * 步骤:
 *    1、首先创建多个带/不带参数的prompt template
 *    2、创建一个最终输出的prompt
 *    3、通过pipelinePromptTemplate类构建完整的prompt
 *    4、执行格式化
 *    5、输出结果
 * 注意点:
 *    1、传入的参数变量可以多次复用
 *    2、pipelinePromptTemplate类同样支持动态自定义和partial
 *
 * const getCurrentDate = () => new Date().toLocaleDateString();
 * const getCurrentTime = () => new Date().toLocaleTimeString();
 * const firstInitPrompt = PromptTemplate.fromTemplate(
 *   "今天的日期是{date}的{period}"
 * );
 * const secondInitPrompt =
 *   PromptTemplate.fromTemplate("姓名: {name}，性别: {sex}");
 * const thirdInitPrompt = PromptTemplate.fromTemplate(`
 *   我想要吃{period}的{food}。
 *   顺便再重复一遍我的个人信息: {info}。
 * `);
 * const finalInitPrompt = PromptTemplate.fromTemplate(`
 *   你好。我是你的智能管家，为你播报现在时间: {time}。
 *   主人的信息是--{info}。
 *
 *   根据上下文，主人的需求任务如下: {tasks}。
 * `);
 * const combinedPrompt = new PipelinePromptTemplate({
 *   pipelinePrompts: [
 *     { name: "time", prompt: firstInitPrompt },
 *     { name: "info", prompt: secondInitPrompt },
 *     { name: "tasks", prompt: thirdInitPrompt },
 *   ],
 *   finalPrompt: finalInitPrompt,
 * });
 * const formattedCombinedPrompt = await combinedPrompt.format({
 *   date: getCurrentDate(),
 *   period: getCurrentTime(),
 *   name: "张三",
 *   sex: "男（male）",
 *   food: "三明治、牛奶",
 * });
 * console.log("combined prompt template:", formattedCombinedPrompt);
 */
