import axios, { CancelToken } from "axios";

export class Retry {
    private cancelSource = axios.CancelToken.source();
    private attemptCount = 0;

    constructor(private maxAttempts = 2, private retryDelayMs = 300) {}

    public async retry<T>(operation: (cancelToken: CancelToken) => Promise<T>): Promise<T> {
        this.attemptCount = 0;

        while (true) {
            try {
                return await operation(this.cancelSource.token);
            } catch (error: any) {
                if (axios.isCancel(error)) {
                    throw error;
                }

                const status = error?.response?.status;
                const shouldRetry = status == null || (status >= 500 && status < 600);

                this.attemptCount += 1;
                if (!shouldRetry || this.attemptCount >= this.maxAttempts) {
                    throw error;
                }

                await new Promise((resolve) => setTimeout(resolve, this.retryDelayMs));
            }
        }
    }

    public cancelRetry(): void {
        this.cancelSource.cancel("Retry cancelled");
    }
}