import { useCallback, useRef } from "react";

export type SearchRequestFn<T> = (signal: AbortSignal) => Promise<T>;

const useSearch = () => {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const controllerRef = useRef<AbortController | null>(null);

    const clear = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        controllerRef.current?.abort();
        controllerRef.current = null;
    }, []);

    const debounce = useCallback((callback: () => void, delay = 300) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = window.setTimeout(() => {
            timeoutRef.current = null;
            callback();
        }, delay);
    }, []);

    const search = useCallback(
        async <T,>(query: string, requestFn: SearchRequestFn<T>, delay = 300): Promise<T> => {
            clear();

            if (!query.trim()) {
                return Promise.resolve({} as T);
            }

            return new Promise<T>((resolve, reject) => {
                controllerRef.current = new AbortController();

                timeoutRef.current = window.setTimeout(async () => {
                    try {
                        const result = await requestFn(controllerRef.current!.signal);
                        resolve(result);
                    } catch (error) {
                        if ((error as DOMException)?.name === "AbortError") {
                            return;
                        }
                        reject(error);
                    } finally {
                        timeoutRef.current = null;
                        controllerRef.current = null;
                    }
                }, delay);
            });
        },
        [clear]
    );

    return {
        search,
        clear,
        debounce,
    };
};

export default useSearch;