export const SearchUtil={
    contains(
        text:string,
        keyword:string
    )
    {
        return text
        .toLowerCase()
        .includes(keyword.toLowerCase());
    }
};