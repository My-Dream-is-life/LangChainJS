# LangChainJS

### Project Description

- LangChain is a robust JavaScript/TypeScript framework designed for developing applications powered by large language models (LLMs). Whether you want to build smart chatbots, automated document processing tools, or complex AI agent systems, LangChain provides modular components and flexible interfaces to help developers efficiently integrate language models (such as OpenAI, Hugging Face, etc.) and connect to external data sources.

### Directory

LangChainJS/  
├─ assets/ # Static resource directory  
├─ config/ # Configuration file directory  
│  ├─ dotenv.ts # Read the.env configuration file  
│  ├─ model.ts # Model definition and configuration file  
├─ node_modules/ # Project Dependency Directory  
├─ src/ # Source file directory  
├─ .env # Environment configuration file  
├─ .gitignore # git ignores files  
├─ .nvmrc # node version control file  
├─ index.ts # Main entry file  
├─ package.json # Dependency package management file  
├─ pnpm-lock.yaml # Dependency packet lock  
├─ README.md # Project description file  
├─ tsconfig.json # TS configuration file

### .env

- OPENAI_API_KEY: openai Key
- BASE_URL: Access the address of the LLM large model
- MODEL: Model version

### Prerequisites

- Git
- Node.js v20.14.0

### Clone the Project

```sh
git clone xxx/your-repo
cd your-repo
```

## Branch Management

- main: The main branch of the project (currently there is only this one branch) only accepts pr when making modifications.

### Install Dependencies

```sh
pnpm install
pnpm add <package-name>
```

### Delete Dependencies

```sh
pnpm remove <package-name>
```

### Run Development Server

```sh
pnpm dev
```
