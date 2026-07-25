class StorageService{
    get<T>(key: string): T | null {
        try {
            const value = localStorage.getItem(key);
            if (!value) return null;
            return JSON.parse(value) as T;
        } catch (error) {
            console.error("Storage get error:", error);
            return null;
        }
    }
    set<T>(key: string, value: T): void {
        try {
            localStorage.setItem(
                key,
                JSON.stringify(value)
            );
        } catch (error) {
            console.error("Storage set error:", error);
        }
    }
    remove(key: string): void {
        localStorage.removeItem(key);
    }
    clear(): void {
        localStorage.clear();
    }
    has(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }
}
export default new StorageService();