import axios from "axios";

const host = 'https://databucket.azurewebsites.net';
const BASE_URL = host;

const axiosInstance =  axios.create({
    baseURL:BASE_URL,
});




export default axiosInstance;