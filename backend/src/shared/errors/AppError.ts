export interface FieldError {
  field: string;
  message: string;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors?: FieldError[];

  constructor(
    statusCode: number,
    message: string,
    options?: {
      isOperational?: boolean;
      errors?: FieldError[];
    }
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = options?.isOperational ?? true;
    this.errors = options?.errors;
    this.name = "AppError";
  }
}
