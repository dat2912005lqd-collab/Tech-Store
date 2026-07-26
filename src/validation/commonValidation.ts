export const CommonValidation = {
    required(value: string): boolean {
        return value.trim().length > 0;
    },
    email(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    minLength(value: string, length: number): boolean {
        return value.length >= length;
    },
    maxLength(value: string, length: number): boolean {
        return value.length <= length;
    },
    positiveNumber(value: number): boolean {
        return value > 0;
    }
};