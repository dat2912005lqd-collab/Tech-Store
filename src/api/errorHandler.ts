type ApiError = {
  message?: string;
  status?: number;
  code?: string;
};

class ErrorHandler {
  private static instance: ErrorHandler;

  private constructor() {}

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  public handle(error: unknown): string {
    if (this.isApiError(error)) {
      return error.message || 'Đã xảy ra lỗi không xác định';
    }

    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === 'string') {
      return error;
    }

    return 'Đã xảy ra lỗi không xác định';
  }

  public getStatusCode(error: unknown): number | undefined {
    if (this.isApiError(error)) {
      return error.status;
    }
    return undefined;
  }

  public isUnauthorized(error: unknown): boolean {
    return this.getStatusCode(error) === 401;
  }

  public log(error: unknown): void {
    console.error('API Error:', error);
  }

  private isApiError(error: unknown): error is ApiError {
    return typeof error === 'object' && error !== null;
  }
}

const errorHandler = ErrorHandler.getInstance();

export default errorHandler;