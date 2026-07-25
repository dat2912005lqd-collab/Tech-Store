import "./Pagination.css";
interface Props {
    page: number;
    totalPages: number;
    onNext: () => void;
    onPrevious: () => void;
}
function Pagination({
    page,
    totalPages,
    onNext,
    onPrevious
}: Props) {
    return (
        <div className="pagination">
            <button
                onClick={onPrevious}
                disabled={page === 1}
            >
                Previous
            </button>
            <span>
                {page} / {totalPages}
            </span>
            <button
                onClick={onNext}
                disabled={page === totalPages}
            >
                Next
            </button>
        </div>
    );
}
export default Pagination;