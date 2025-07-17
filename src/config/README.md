# Configuration

This directory contains centralized configuration for the ZuluNiner application.

## Usage

```typescript
import { config } from '@/config/config';

// LLM Configuration
const model = config.llm.model; // 'gpt-4.1-mini'
const responseFormat = config.llm.responseFormat.json; // 'json'

// Auto-populate settings
const progressInterval = config.autoPopulate.progressUpdateInterval; // 200ms

// API settings
const timeout = config.api.timeout; // 60000ms

// Content generation limits
const maxTitleLength = config.contentGeneration.maxTitleLength; // 200
```

## Examples

### API Route using LLM config:
```typescript
import { config } from '@/config/config';
import { disco } from '@discomedia/utils';

const response = await disco.llm.call(prompt, {
  model: config.llm.model,
  responseFormat: config.llm.responseFormat.json,
});
```

### Component using auto-populate config:
```typescript
import { config } from '@/config/config';

const progressInterval = setInterval(() => {
  // update progress
}, config.autoPopulate.progressUpdateInterval);
```

## Configuration Sections

- **llm**: LLM model and response format settings
- **autoPopulate**: Auto-populate feature timing and validation
- **api**: API timeout and rate limiting settings
- **contentGeneration**: Content length limits and validation
- **fileUpload**: File upload constraints and allowed types
- **search**: Search debouncing and result limits
- **isDevelopment/isProduction**: Environment detection