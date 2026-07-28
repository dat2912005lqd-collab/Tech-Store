import { useState } from "react";
interface Props {
    onSearch: (keyword: string) => void;
}

function SearchBar({
    onSearch
}: Props) {
    const [keyword, setKeyword] = useState("");
    return (
        <input
            type="text"
            placeholder="Search product..."
            value={keyword}
            onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
                setKeyword(e.target.value);
                onSearch(e.target.value);
            }}
        />
    );
}
export default SearchBar;