export const ValidationUtil = {
    isEmail(email: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);
    },
    required(value: string) {
        return value.trim().length > 0;
    }
};