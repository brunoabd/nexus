export class InvalidLLMOutputError extends Error {
  readonly code = 'INVALID_LLM_OUTPUT';

  constructor(message = 'LLM output is invalid.') {
    super(message);
    this.name = 'InvalidLLMOutputError';
  }
}

export class ToolNotFoundError extends Error {
  readonly code = 'TOOL_NOT_FOUND';

  constructor(message = 'Tool not found.') {
    super(message);
    this.name = 'ToolNotFoundError';
  }
}

export class ToolValidationError extends Error {
  readonly code = 'TOOL_VALIDATION_ERROR';

  constructor(message = 'Tool arguments failed validation.') {
    super(message);
    this.name = 'ToolValidationError';
  }
}

export class ToolExecutionBlockedError extends Error {
  readonly code = 'TOOL_EXECUTION_BLOCKED';

  constructor(message = 'Tool execution blocked by policy.') {
    super(message);
    this.name = 'ToolExecutionBlockedError';
  }
}
