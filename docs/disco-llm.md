# Disco LLM API Documentation

## Overview

The Disco LLM API provides access to multiple AI language models and image generation capabilities through a unified interface. Supports OpenAI (GPT-4, o1, o3 series), Deepseek, OpenRouter, and image generation with automatic cost tracking and conversation state management.

## Quick Start

```typescript
import { disco } from '@discomedia/utils';

// Basic text generation
const response = await disco.llm.call('Explain quantum computing');

// Image generation
const image = await disco.llm.images('A beautiful sunset over mountains');

// Deepseek API
const seekResponse = await disco.llm.seek('What is the capital of France?');

// OpenRouter API
const openResponse = await disco.llm.open('Explain quantum computing');
```

## Core Functions

### `disco.llm.call(input, options?)`
Main function for OpenAI text generation using the Responses API.

**Input:**
```typescript
input: string
options?: {
  apiKey?: string;
  model?: LLMModel;
  responseFormat?: 'text' | 'json';
  tools?: Tool[];
  useCodeInterpreter?: boolean;
  useWebSearch?: boolean;
  imageBase64?: string;
  imageDetail?: 'low' | 'high' | 'auto';
  context?: ContextMessage[];
}
```

**Output:**
```typescript
{
  response: T;
  usage: LLMUsage;
  tool_calls?: ChatCompletionMessageToolCall[];
  code_interpreter_outputs?: any[];
}
```

**Usage:**
```typescript
// Basic text response
const response = await disco.llm.call('What is TypeScript?');

// JSON response
const data = await disco.llm.call('List 3 programming languages', {
  responseFormat: 'json'
});

// With conversation context
const contextResponse = await disco.llm.call('What did I ask about earlier?', {
  context: [
    { role: 'user', content: 'What is React?' },
    { role: 'assistant', content: 'React is a JavaScript library...' }
  ]
});

// With image analysis
const imageResponse = await disco.llm.call('Describe this image', {
  imageBase64: 'base64-encoded-image-data',
  imageDetail: 'high'
});

// With web search
const webResponse = await disco.llm.call('Latest AI news', {
  useWebSearch: true
});

// With code interpreter
const codeResponse = await disco.llm.call('Create a chart of sales data', {
  useCodeInterpreter: true
});
```

### `disco.llm.images(prompt, options?)`
Generate images using OpenAI's image generation API.

**Input:**
```typescript
prompt: string
options?: {
  model?: 'gpt-image-1.5' | 'gpt-image-1' | 'gpt-image-1-mini' | 'dall-e-2' | 'dall-e-3'; // defaults to 'gpt-image-1.5'
  size?: 'auto' | '1024x1024' | '1024x1536' | '1536x1024';
  outputFormat?: 'jpeg' | 'png' | 'webp';
  compression?: number;
  quality?: 'auto' | 'low' | 'medium' | 'high';
  count?: number;
  background?: 'auto' | 'transparent' | 'opaque';
  moderation?: 'auto' | 'low';
  apiKey?: string;
  visionModel?: LLMModel; // e.g., 'gpt-5.2' to pair with a reasoning follow-up
}
```

`gpt-image-1.5` is the default model when none is provided, giving you the latest GPT image quality without extra configuration.

**Output:**
```typescript
{
  data: Array<{
    url?: string;
    b64_json?: string;
    revised_prompt?: string;
  }>;
  usage: {
    provider: string;
    model: string;
    cost: number;
    visionModel?: LLMModel;
  };
}
```

**Usage:**
```typescript
// Basic image generation
const image = await disco.llm.images('A futuristic cityscape');

// Multiple images with custom options
const images = await disco.llm.images('A birthday cake', {
  size: '1024x1024',
  outputFormat: 'png',
  quality: 'high',
  count: 3
});

// High compression for web
const webImage = await disco.llm.images('Logo design', {
  outputFormat: 'webp',
  compression: 80,
  background: 'transparent'
});

// Opt into a different model explicitly
const dalleImage = await disco.llm.images('Editorial illustration of a skyline', {
  model: 'dall-e-3',
  responseFormat: 'url'
});

// Pair with a multimodal reasoning model (GPT-5.2 series)
const blueprint = await disco.llm.images('Blueprint for a tiny house', {
  visionModel: 'gpt-5.2'
});
console.log(blueprint.usage?.visionModel); // 'gpt-5.2'
```

### `disco.llm.seek(content, responseFormat?, options?)`
Call Deepseek AI models for cost-effective text generation.

**Input:**
```typescript
content: string | ChatCompletionContentPart[]
responseFormat?: 'text' | 'json'
options?: LLMOptions
```

**Output:**
```typescript
{
  response: T;
  usage: LLMUsage;
  tool_calls?: ChatCompletionMessageToolCall[];
}
```

**Usage:**
```typescript
// Basic Deepseek call
const response = await disco.llm.seek('Explain machine learning');

// JSON response
const data = await disco.llm.seek('List programming concepts', 'json');

// With reasoning model
const reasoning = await disco.llm.seek('Solve this math problem step by step', 'text', {
  model: 'deepseek-reasoner'
});

// With context
const contextual = await disco.llm.seek('Continue our discussion', 'text', {
  context: [
    { role: 'user', content: 'What is AI?' },
    { role: 'assistant', content: 'AI stands for...' }
  ]
});
```

### `disco.llm.open(input, options?)`
Call OpenRouter API for access to multiple model providers including OpenAI, Google, Deepseek, and Z.ai models through a unified interface.

**Input:**
```typescript
input: string
options?: {
  apiKey?: string;
  model?: OpenRouterModel | string;
  responseFormat?: 'text' | 'json' | OpenAIResponseFormat;
  tools?: ChatCompletionTool[];
  toolChoice?: ToolChoice;
  context?: ContextMessage[];
  developerPrompt?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string | string[];
  seed?: number;
  referer?: string;
  title?: string;
}
```

**Output:**
```typescript
{
  response: T;
  usage: LLMUsage;
  tool_calls?: ChatCompletionMessageToolCall[];
}
```

**Usage:**
```typescript
// Basic OpenRouter call
const response = await disco.llm.open('Explain machine learning');

// With specific model
const modelResponse = await disco.llm.open('Explain AI', {
  model: 'openai/gpt-4o-mini'
});

// With Google model
const googleResponse = await disco.llm.open('Explain quantum computing', {
  model: 'google/gemini-2.5-flash'
});

// With custom headers
const customResponse = await disco.llm.open('Hello', {
  referer: 'https://myapp.com',
  title: 'My App'
});

// JSON response
const data = await disco.llm.open('List 3 colors', {
  responseFormat: 'json'
});

// With tools
const toolsResponse = await disco.llm.open('Get weather', {
  tools: [weatherTool],
  toolChoice: 'auto'
});
```

## Models & Capabilities

### OpenAI Models
- **gpt-4o-mini**: Fast, cost-effective for simple tasks
- **gpt-4o**: Balanced performance and cost
- **o1-mini**: Reasoning model for complex problems
- **o1**: Advanced reasoning capabilities
- **o3-mini**: Latest reasoning model
- **o3**: Most advanced reasoning model
- **gpt-4.1-mini**: High performance, low cost
- **gpt-4.1**: High performance, advanced capabilities
- **gpt-4.1-nano**: Ultra-low cost, basic tasks
- **o4-mini**: Latest reasoning model with high efficiency
- **gpt-5**: Next-gen model with advanced reasoning
- **gpt-5.1**: Drop-in GPT-5 upgrade tuned for Responses API
- **gpt-5.2**: Flagship model for complex reasoning, agentic workflows, and multimodal tasks
- **gpt-5.2-pro**: Uses more compute for tougher questions; best when you want the most consistent answers
- **gpt-5-mini**: Cost-effective version of GPT-5
- **gpt-5-nano**: Ultra-low cost, basic tasks
- **gpt-5.1-codex**: Optimized for interactive coding flows inside Codex CLI
- **gpt-5.1-codex-max**: Highest-capability coding model with support for xhigh reasoning

**GPT-5.2 Series Pricing (per 1M tokens)**

| Model             | Input | Output |
| ----------------- | ----- | ------ |
| gpt-5.2           | $1.50 | $12.00 |
| gpt-5.2-pro       | $3.00 | $24.00 |
| gpt-5.1-codex     | $1.10 | $8.80  |
| gpt-5.1-codex-max | $1.80 | $14.40 |

### Deepseek Models
- **deepseek-chat**: General purpose, supports tools/JSON
- **deepseek-reasoner**: Specialized for reasoning tasks

### OpenRouter Models
- **openai/gpt-5**: Next-gen OpenAI model via OpenRouter
- **openai/gpt-5-mini**: Cost-effective GPT-5 via OpenRouter
- **openai/gpt-5-nano**: Ultra-low cost GPT-5 via OpenRouter
- **openai/gpt-5.2**: GPT-5.2 flagship via OpenRouter for complex reasoning
- **openai/gpt-5.2-pro**: Highest quality GPT-5.2 variant via OpenRouter
- **openai/gpt-5.1-codex**: Coding-oriented GPT-5.1 via OpenRouter
- **openai/gpt-5.1-codex-max**: Maximum-strength Codex model via OpenRouter
- **openai/gpt-oss-120b**: Open source 120B parameter model
- **z.ai/glm-4.5**: Z.ai's GLM-4.5 model
- **z.ai/glm-4.5-air**: Z.ai's GLM-4.5 Air model
- **google/gemini-2.5-flash**: Google's Gemini 2.5 Flash model
- **google/gemini-2.5-flash-lite**: Lightweight Gemini 2.5 Flash
- **deepseek/deepseek-r1-0528**: Deepseek R1 model via OpenRouter
- **deepseek/deepseek-chat-v3-0324**: Deepseek Chat v3 model via OpenRouter

### Model Features
```typescript
// Check model capabilities
import { supportsTemperature, isReasoningModel } from '@discomedia/utils';

const hasTemp = supportsTemperature('gpt-4o');      // true
const isReasoning = isReasoningModel('o1-mini');    // true
```

#### GPT-5.2 reasoning controls
- `gpt-5.2` and `gpt-5.2-pro` accept `reasoning_effort` values `'none' | 'low' | 'medium' | 'high' | 'xhigh'`. Use `'none'` when you need to set `temperature`, `top_p`, or `logprobs`.
- Responses API can now pass concise reasoning summaries plus compaction metadata, making it easier to resume long agentic tasks.

#### Verbosity options
- Keep `text.verbosity` at `medium` for balanced answers, or move to `high` for detailed walk-throughs. `low` compresses answers for quick SQL/code snippets.

#### Coding-specialized GPT-5.1 Codex models
- `gpt-5.1-codex` focuses on interactive coding in Codex/Codex-like shells.
- `gpt-5.1-codex-max` adds the `xhigh` reasoning level, structured outputs, and native compaction for very long coding sessions.

## Built-in Tools

### Web Search
```typescript
const response = await disco.llm.call('Current weather in Tokyo', {
  useWebSearch: true
});
```

### Code Interpreter
```typescript
const response = await disco.llm.call('Plot a sine wave', {
  useCodeInterpreter: true
});
// Access code outputs
console.log(response.code_interpreter_outputs);
```

### Custom Tools
```typescript
const tools = [{
  type: 'function',
  function: {
    name: 'get_weather',
    description: 'Get current weather',
    parameters: {
      type: 'object',
      properties: {
        location: { type: 'string' }
      }
    }
  }
}];

const response = await disco.llm.call('Weather in Paris', { tools });
```

## Conversation Context

### Context Messages
```typescript
interface ContextMessage {
  role: 'user' | 'assistant' | 'system' | 'developer';
  content: string;
}
```

### Multi-turn Conversations
```typescript
const conversation: ContextMessage[] = [
  { role: 'user', content: 'What is React?' },
  { role: 'assistant', content: 'React is a JavaScript library...' },
  { role: 'user', content: 'What about Vue?' },
  { role: 'assistant', content: 'Vue is another JavaScript framework...' }
];

const response = await disco.llm.call('Compare them', {
  context: conversation
});
```

## Response Formats

### Text Response
```typescript
const response = await disco.llm.call('Explain AI');
console.log(response.response); // string
```

### JSON Response
```typescript
const response = await disco.llm.call('List 3 colors', {
  responseFormat: 'json'
});
console.log(response.response); // parsed JSON object
```

### Structured JSON (OpenAI only)
```typescript
const response = await disco.llm.call('Create user profile', {
  responseFormat: {
    type: 'json_schema',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
        interests: { type: 'array', items: { type: 'string' } }
      },
      required: ['name', 'age']
    }
  }
});
```

## Usage & Cost Tracking

### Usage Information
```typescript
const response = await disco.llm.call('Hello world');
console.log(response.usage);
/*
{
  prompt_tokens: 12,
  completion_tokens: 8,
  reasoning_tokens: 0,
  provider: 'openai',
  model: 'gpt-5.2',
  cost: 0.000123
}
*/
```

### Cost Optimization
```typescript
// Use cost-effective models for simple tasks
const simple = await disco.llm.call('Say hello', { model: 'gpt-4o-mini' });

// Use Deepseek for budget-friendly alternatives
const budget = await disco.llm.seek('Explain concepts');

// Use reasoning models only when needed
const complex = await disco.llm.call('Solve complex problem', { model: 'o1-mini' });
```

## Error Handling

```typescript
try {
  const response = await disco.llm.call('Hello');
} catch (error) {
  if (error.message.includes('API key')) {
    console.error('Check your API key configuration');
  } else if (error.message.includes('model')) {
    console.error('Unsupported model specified');
  } else {
    console.error('API call failed:', error.message);
  }
}
```

## Environment Setup

```bash
# Required environment variables
OPENAI_API_KEY=your-openai-key
DEEPSEEK_API_KEY=your-deepseek-key
```

## Types

### Core Types
```typescript
interface LLMResponse<T> {
  response: T;
  usage: LLMUsage;
  tool_calls?: ChatCompletionMessageToolCall[];
}

interface LLMUsage {
  prompt_tokens: number;
  completion_tokens: number;
  reasoning_tokens?: number;
  provider: string;
  model: LLMModel;
  cost: number;
}

type LLMModel = OpenAIModel | DeepseekModel | OpenRouterModel;
type OpenAIModel =
  | 'gpt-4o-mini'
  | 'gpt-4o'
  | 'o1-mini'
  | 'o1'
  | 'o3-mini'
  | 'gpt-4.1'
  | 'gpt-4.1-mini'
  | 'o4-mini'
  | 'gpt-4.1-nano'
  | 'o3'
  | 'gpt-5'
  | 'gpt-5-mini'
  | 'gpt-5-nano'
  | 'gpt-5.1'
  | 'gpt-5.2'
  | 'gpt-5.2-pro'
  | 'gpt-5.1-codex'
  | 'gpt-5.1-codex-max';
type DeepseekModel = 'deepseek-chat' | 'deepseek-reasoner';
type OpenRouterModel =
  | 'openai/gpt-5'
  | 'openai/gpt-5-mini'
  | 'openai/gpt-5-nano'
  | 'openai/gpt-5.1'
  | 'openai/gpt-5.2'
  | 'openai/gpt-5.2-pro'
  | 'openai/gpt-5.1-codex'
  | 'openai/gpt-5.1-codex-max'
  | 'openai/gpt-oss-120b'
  | 'z.ai/glm-4.5'
  | 'z.ai/glm-4.5-air'
  | 'google/gemini-2.5-flash'
  | 'google/gemini-2.5-flash-lite'
  | 'deepseek/deepseek-r1-0528'
  | 'deepseek/deepseek-chat-v3-0324';

interface OpenRouterCallOptions {
  apiKey?: string;
  model?: OpenRouterModel | string;
  responseFormat?: 'text' | 'json' | OpenAIResponseFormat;
  tools?: ChatCompletionTool[];
  toolChoice?: ToolChoice;
  context?: ContextMessage[];
  developerPrompt?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string | string[];
  seed?: number;
  referer?: string;
  title?: string;
}
```
