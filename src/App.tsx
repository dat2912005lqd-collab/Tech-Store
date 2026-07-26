import React from 'react';
import {useEffect, useState} from 'react';
function App() {
    const [data, setData] = useState(null);
    useEffect(() => {
        fetch('https://dummyjson.com')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error fetching data:', error));
    }
, []);
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
    return <AppRoutes />;
}
export default App;