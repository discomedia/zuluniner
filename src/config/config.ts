// Central configuration for the ZuluNiner application

export const config = {
  // LLM Configuration
  llm: {
    model: 'gpt-4.1-mini' as const,
    timeout: 30000, // 30 seconds
    maxRetries: 3,
    responseFormat: {
      text: 'text' as const,
      json: 'json' as const,
    },
  },

  // Auto-populate specific settings
  autoPopulate: {
    progressUpdateInterval: 200, // milliseconds
    estimatedDuration: 15000, // 15 seconds
    validationTimeout: 5000, // 5 seconds for validation
  },

  // API Configuration
  api: {
    rateLimit: {
      maxRequests: 100,
      windowMs: 15 * 60 * 1000, // 15 minutes
    },
    timeout: 60000, // 60 seconds
  },

  // Content Generation
  contentGeneration: {
    maxTitleLength: 200,
    maxDescriptionLength: 2000,
    maxMetaDescriptionLength: 160,
  },

  // File Upload Configuration
  fileUpload: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFiles: 20,
  },

  // Search Configuration
  search: {
    debounceMs: 300,
    maxResults: 50,
    defaultLimit: 12,
  },

  // Environment-specific overrides
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};