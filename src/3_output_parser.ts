import {
  StringOutputParser,
  StructuredOutputParser,
  CommaSeparatedListOutputParser,
} from "@langchain/core/output_parsers";
import { HumanMessage } from "@langchain/core/messages";
import { model } from "../config/model.js";
import { PromptTemplate } from "@langchain/core/prompts";
import * as z from "zod";
import { OutputFixingParser } from "langchain/output_parsers";

/**
 * StringOutputParser: 能够通过该类获取返回大模型文本(content)输出
 * 步骤:
 *    1、定义一个StringOutputParser类
 *    2、通过pipe方法拼接模型
 *    3、调用invoke方法输出结果
 *
 * const outputParser = new StringOutputParser();
 * const simpleChain = model.pipe(outputParser);
 * const outputParserResponse = await simpleChain.invoke([
 *   new HumanMessage("How are you?"),
 * ]);
 * console.log("output parser response:", outputParserResponse);
 */

/**
 * StructuredOutputParser: 该类可以指定输出格式引导模型进行自定义格式输出
 * 步骤:
 *    1、通过StructuredOutputParser类的fromNamesAndDescriptions方法定义相关输出格式(如答案、依据、信心等)
 *    2、可以通过getFormatInstructions方法获取上述定义格式的指令和响应的结果结构(可以省略)
 *    3、创建一个带有参数的prompt template(参数需要包涵对应类的指令)
 *    4、通过pipe方法拼接模型和结构格式化输出(structuredOutputParser)
 *    5、执行invoke方法输出结果
 *
 * const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
 *   answer: "回答用户问题的答案",
 *   evidence: "你回答用户问题所依赖的依据",
 *   confidence: "你对回答用户问题的信心",
 * });
 * const formattedOutputParser = outputParser.getFormatInstructions();
 * console.log(
 *   "formatted structured output parser response:",
 *   formattedOutputParser
 * );
 * const initPrompt = PromptTemplate.fromTemplate(
 *   "请尽可能的回答用户的问题 \n{instructions} \n{question}"
 * );
 * const completedChain = initPrompt.pipe(model).pipe(outputParser);
 * const structuredOutputParserResponse = await completedChain.invoke({
 *   question: "你好，请为我介绍日本东映公司的历史",
 *   instructions: outputParser.getFormatInstructions(),
 * });
 * console.log(
 *   "structured output parser response:",
 *   structuredOutputParserResponse
 * );
 */

/**
 * 列表类Output Parser: 该类指定模型输出格式为数组列表
 * 步骤:
 *    1、新定义一个CommaSeparatedListOutputParser类变量
 *    2、可以通过getFormatInstructions方法获取定义格式的指令和响应的结果结构(可以省略)
 *    3、创建一个带有参数的prompt template(参数需要包涵对应类的指令)
 *    4、通过pipe方法拼接模型和结构格式化输出(commaSeparatedListOutputParser)
 *    5、执行invoke方法输出结果
 *
 * const listOutputParser = new CommaSeparatedListOutputParser();
 * const formattedListOutputParser = listOutputParser.getFormatInstructions();
 * console.log(
 *   "formatted comma separated list output parser:",
 *   formattedListOutputParser
 * );
 * const initPrompt = PromptTemplate.fromTemplate(
 *   "麻烦请用中文回答，请列出你所知道的{count}个{area}动画公司 \n{instructions}"
 * );
 * const completedChain = initPrompt.pipe(model).pipe(listOutputParser);
 * const commaSeparatedListOutputParserResponse = await completedChain.invoke({
 *   count: 5,
 *   area: "日本",
 *   instructions: listOutputParser.getFormatInstructions(),
 * });
 * console.log(
 *   "comma separated list output parser response:",
 *   commaSeparatedListOutputParserResponse
 * );
 */

/**
 * Auto Fix Parser: 如模型输出了不符合要求的情况，可以将报错信息返回给LLM
 * 步骤:
 *    1、首先使用相关类型验证库(zod)定义变量类型
 *    2、使用StructuredOutputParser(结构化格式输出)类的fromZodSchema方法解析LLM
 *    3、创建生成答案的模版(instructions: 格式化输出的说明替换符，question: 问题参数)
 *    4、拼接为一条完整的Chain
 *    5、输出结果
 *    6、当结果不符合最初定义的schema时，就可以使用OutputFixingParser类中的fromLLM方法(参数一: 模型, 参数二: 验证规则)修复错误
 *    7、通过Json类型转换进行错误修复返回结果
 * 注意点:
 *    1、修复器不能修复事件事实错误，而是只能修复自定义的相关数据类型、数据以及字段错误
 *
 * const schema = z.object({
 *   answer: z.string().describe("用户问题的答案"),
 *   confidence: z
 *     .number()
 *     .min(0)
 *     .max(100)
 *     .describe("你对回答的信心，满分为100分"),
 * });
 * const outputParser = StructuredOutputParser.fromZodSchema(schema);
 * const initPrompt = PromptTemplate.fromTemplate(
 *   "请尽可能的回答用户的问题 \n{instructions} \n{question}"
 * );
 * const completedChain = initPrompt.pipe(model).pipe(outputParser);
 * const schemaResponse = await completedChain.invoke({
 *   question: "你好，请问东京阿尼动画在哪一年发生了火灾？",
 *   instructions: outputParser.getFormatInstructions(),
 * });
 * console.log("schema response", schemaResponse);
 * const fixParser = OutputFixingParser.fromLLM(model, outputParser);
 * const fixedResponse = await fixParser.parse(JSON.stringify(schemaResponse));
 * console.log("fixed response:", fixedResponse);
 */
