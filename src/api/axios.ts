import axios from "axios";

export interface ApiError {
    code: string;
    message: string;
    status: number;
    details?: unknown;
}

export class ErrorHandler {
    public static getError(error: unknown): ApiError {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status ?? 0;
            const data = error.response?.data;

            return {
                code:
                    typeof data?.code === "string"
                        ? data.code
                        : error.code ?? "API_ERROR",
                message:
                    typeof data?.message === "string"
                        ? data.message
                        : error.message || "Unknown API error",
                status,
                details: data,
            };
        }

        if (error instanceof Error) {
            return {
                code: "UNKNOWN_ERROR",
                message: error.message,
                status: 0,
            };
        }

        return {
            code: "UNKNOWN_ERROR",
            message: "Unknown error",
            status: 0,
        };
    }

    public static getStatus(error: unknown): number {
        return ErrorHandler.getError(error).status;
    }

    public static getMessage(error: unknown): string {
        return ErrorHandler.getError(error).message;
    }

    public static mapError(error: unknown): ApiError {
        return ErrorHandler.getError(error);
    }
}