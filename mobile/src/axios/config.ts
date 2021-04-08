import axios from "axios";


const BASE_URL = 'http://databucket-env-1.eba-mxjyzwxn.eu-west-3.elasticbeanstalk.com';

const axiosInstance =  axios.create({
    baseURL:BASE_URL,
});


export default axiosInstance;