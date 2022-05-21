import axios from 'axios';

export default axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
    headers: {
        'Content-Type': 'application/json',
    },
    transformRequest: [function (data, headers) {
        const token = localStorage.getItem('token');
        if (token) {
            headers.Authorization = "Bearer " + token;
        }
        return JSON.stringify(data);
    }],
});
