import axios from "axios";

export const axiosInstance = axios.create();

export const apiConnector = (method, url, bodyData, headers, params) => {
    // Replace HTTPS with HTTP only for localhost
    const fixedUrl = url.startsWith("https://localhost") ? url.replace("https://", "http://") : url;

    return axiosInstance({
        method,  // No need for string interpolation
        url: fixedUrl,
        data: bodyData || undefined, // Cleaner null handling
        headers: headers || undefined,
        params: params || undefined,
    });
};
