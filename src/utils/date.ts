export const DateUtil = {
    format(date: string) {
        return new Date(date)
            .toLocaleDateString(
                "vi-VN"
            );
    }
};