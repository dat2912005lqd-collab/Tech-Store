export const FormatUtil = {
    capitalize(text: string) {
        return text.charAt(0).toUpperCase()
            + text.slice(1);
    },
    truncate(
        text: string,
        length = 100
    ) {
        return text.length > length
            ? text.substring(0,length) + "..."
            : text;
    }
};