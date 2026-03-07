/**
 * API Utilities - Central Export
 *
 * Provides a centralized export for all API utilities
 */

// Error handling
export {
  ApiError,
  ValidationError,
  AuthenticationError,
  InvalidCredentialsError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  ExternalApiError,
  ApiErrorCode,
  handleApiError,
  withErrorHandler,
  type ErrorResponse
} from './errors'

// Response formatting
export {
  apiSuccess,
  apiSuccessPaginated,
  apiCreated,
  apiNoContent,
  apiSuccessWithCache,
  apiSuccessWithCors,
  handleCorsPreFlight,
  getRequestId,
  type SuccessResponse,
  type PaginatedResponse,
  type ResponseMeta
} from './response'

// Validation
export {
  validateRequestBody,
  validateQueryParams,
  validateHeaders,
  commonSchemas,
  sanitizeString,
  parseInteger,
  parseBoolean,
  validateArray,
  extractBearerToken,
  validateFile,
  createPartialSchema
} from './validation'

// Logging
export {
  apiLogger,
  createContextLogger,
  performanceTimer,
  redactSensitiveData,
  LogLevel,
  type LogContext
} from './logger'

// Rate limiting
export {
  checkRateLimit,
  createRateLimiter,
  rateLimiters,
  checkUserRateLimit,
  getRateLimitStatus,
  resetRateLimit,
  clearAllRateLimits,
  createSlidingWindowLimiter,
  createAdaptiveRateLimiter,
  type RateLimitConfig
} from './rate-limit'

// Middleware
export {
  withMiddleware,
  loggingMiddleware,
  rateLimitMiddleware,
  corsMiddleware,
  authenticationMiddleware,
  cacheMiddleware,
  contentTypeMiddleware,
  timeoutMiddleware,
  methodMiddleware,
  middlewareStacks,
  type RouteHandler,
  type RouteContext,
  type Middleware
} from './middleware'
