import axios from "axios";


const BASE_URL = `http://192.168.1.4:8080`;

const axiosInstance =  axios.create({
    baseURL:BASE_URL,
});


export default axiosInstance;