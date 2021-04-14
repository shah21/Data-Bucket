import axios from "axios";


const BASE_URL = 'http://databucket-env.eba-fbg8ah82.us-east-2.elasticbeanstalk.com';

const axiosInstance =  axios.create({
    baseURL:BASE_URL,
});


export default axiosInstance;