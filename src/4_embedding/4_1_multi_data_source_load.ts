import path from "path";
import * as pdfParser from "pdf-parse";
import { Document } from "langchain/document";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import "cheerio";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

/**
 * Document类: LangChain对于所有类型数据的一个统一抽象
 * 属性:
 *    1、pageContent: 文本内容，就是文档对象对应的文本数据
 *    2、metadata: 文本数据所对应的元数据(如: 原始文档标题、页数等信息，后续构建的向量数据库可以基于此进行筛选)
 * 说明: 一般来说属性是由各种Loader自动创建，但是我们也可以手动进行创建
 *
 * const customTestDocument = new Document({
 *   pageContent: "Hello World!",
 *   metadata: {
 *     source: "ABC title",
 *   },
 * });
 * console.log("custom test document:", customTestDocument);
 */

/**
 * TextLoader类: txt文本来源加载器
 * 注意: 在node环境中直接使用相对路径可能无法识别，需要使用path构建绝对路径
 *
 * const _dirname = path.dirname(new URL(import.meta.url).pathname);
 * const filePath = path.resolve(_dirname, "../../assets/小石潭记.txt");
 * const loader = new TextLoader(filePath);
 * const textFileDocs = await loader.load();
 * console.log("text file docs:", textFileDocs);
 */

/**
 * PDFLoader类: pdf数据来源加载器
 * 注意: 打印出来的Document数组，每个对象都对应PDF中的一页，这是PDFLoader类的默认行为
 * 可通过splitPages参数关闭默认切分特性(不分页的单个对象)
 *
 * const _dirname = path.dirname(new URL(import.meta.url).pathname);
 * const filePath = path.resolve(_dirname, "../../assets/LLMBook.pdf");
 * const loader = new PDFLoader(filePath, { splitPages: false });
 * const pdfFileDocs = await loader.load();
 * console.log("pdf file docs:", pdfFileDocs);
 */

/**
 * DirectoryLoader类: 目录数据来源加载器
 * 当我们需要加载文件夹下多种格式的文件时可以使用该类进行数据加载
 * 须先预设对该文件夹下不同文件类型的loader
 * 结果所返回的内容是由Document对象所组成的数组
 *
 * const _dirname = path.dirname(new URL(import.meta.url).pathname);
 * const directoryPath = path.resolve(_dirname, "../../assets");
 * const loader = new DirectoryLoader(directoryPath, {
 *   ".txt": (path) => new TextLoader(path),
 *   ".pdf": (path) => new PDFLoader(path, { splitPages: false }),
 * });
 * const directoryFileDocs = await loader.load();
 * console.log("directory file docs:", directoryFileDocs);
 */

/**
 * WebLoader类: 网络数据来源加载器
 * 能够根据需求去互联网爬取数据，然后根据上下文做出相应回答
 */

/**
 * GithubLoader类: 开源项目所构建的数据库来源加载器
 * 根据用户的提问去该数据库中寻找相关代码片段，然后根据上下文做出相应回答
 * GithubRepoLoader类相关参数:
 *    1、branch: 爬取的github仓库目标分支
 *    2、recursive: 是否递归访问文件夹内部的内容，如果这里是为了测试效果的话建议关闭，请求量会很大
 *    3、ignorePaths: 使用的是git ignore的语法，忽略掉一些特定格式的文件，如json、md文件
 *    4、accessToken: 是github API的accessToken，如果没有设置，也是可以访问的，但是有频率的限制
 * 注意: 获取github相关文件时须先安装ignore包，以便GithubRepoLoader类更加高效灵活的处理加载相关文件
 *
 * const loader = new GithubRepoLoader(
 *   "https://github.com/My-Dream-is-life/LangChainJS",
 *   {
 *     branch: "main",
 *     recursive: false,
 *     ignorePaths: [".md", ".json", "node_modules"],
 *   }
 * );
 * const githubDocs = await loader.load();
 * console.log("github docs:", githubDocs);
 */

/**
 * CheerioWebBaseLoader类: 网络数据来源加载器
 * 提取网页中的信息主要使用CheerioWebBaseLoader类来提取和处理HTML内容
 * CheerioWebBaseLoader类相关参数:
 *    1、webPath: 需要提取的web link
 *    2、fields: 包含相关筛选过滤操作
 * 说明: 主要针对静态HTML, 无法运行JS
 *
 * const loader = new CheerioWebBaseLoader(
 *   "https://juejin.cn/post/7536467524998103092",
 *   { selector: "h1" }
 * );
 * const webHtmlDocs = await loader.load();
 * console.log("web html docs:", webHtmlDocs);
 */

/**
 * SerpAPILoader类: 网络检索数据来源加载器
 * 如果要接入网络检索能力, 可以使用该类或者SearchApiLoader类
 * 说明:
 *    1、两者免费计划都是每个月250次检索的能力
 *    2、支持Google、Baidu、bing等常用引擎
 */
