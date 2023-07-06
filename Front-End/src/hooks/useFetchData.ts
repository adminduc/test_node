import axios from "axios";
import { useState, useEffect } from "react";

const intansce = axios.create({
    baseURL: "http://localhost:8080/api",
});

// Add a request interceptor
intansce.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    return Promise.reject(error);
});

intansce.interceptors.response.use(function (response) {

    return response.data;
}, function (error) {
    return Promise.reject(error);
});

const useFetchData = (url: string) => {
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await intansce.get(url);
                setLoading(false);
                setError(null)
                setData(result.data);
            } catch (error: any) {
                setError(error);
            }
        };
        fetchData();
    }, [url]);

    return { data, loading, error };
};

export default useFetchData;



