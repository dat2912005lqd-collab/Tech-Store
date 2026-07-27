import React, { useEffect, useState } from 'react';
// Nếu bạn đang sử dụng React Router, import các component cần thiết
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    const [data, setData] = useState(null);
    
    useEffect(() => {
        fetch('https://dummyjson.com')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => {
                // Xử lý lỗi với type safety
                if (error instanceof Error) {
                    console.error('Error fetching data:', error.message);
                } else {
                    console.error('Unknown error:', error);
                }
            });
    }, []);

    return (
        <div>
            <h1>Data from API</h1>
            {data ? (
                <pre>{JSON.stringify(data, null, 2)}</pre>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
    // Xóa dòng này - nó gây lỗi return thừa
    // return <AppRoutes />;
}

export default App;