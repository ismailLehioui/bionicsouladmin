import axios from "axios";

const request = axios.create({
    baseURL: process.env.NODE_ENV === 'production'
        ? "https://www.bionicsoul.net/api"
        : "http://localhost:5000/api"
});

export default request;

