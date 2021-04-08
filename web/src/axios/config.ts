import axios from "axios";
// import Cookie from "js-cookie";
// import endpoints from "./endpoints";


const host = 'http://databucket-env-1.eba-mxjyzwxn.eu-west-3.elasticbeanstalk.com';
const BASE_URL = host;

const axiosInstance =  axios.create({
    baseURL:BASE_URL,
});



// axiosInstance.interceptors.response.use(
//   (response) =>{
//     console.log(response);
//     return response;
//   },
//   (error) => {

//     const originalRequest = error.config;
//     // Prevent infinite loops
//     if (
//       error.response.status === 401 &&
//       originalRequest.url === BASE_URL + endpoints.refreshToken
//     ) {
//       console.log("Not authenticated");
//       window.location.href = "/login/";
//       return Promise.reject(error);
//     }

//     if (
//       error.response.data.message === "Token not valid" &&
//       error.response.status === 401 &&
//       error.response.statusText === "Unauthorized"
//     ) {

      

//       const refreshToken = Cookie.get("refreshToken");

//       try{

//       if (refreshToken) {
        
    
//         // const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));
  
//         // exp date in token is expressed in seconds, while now() returns milliseconds:
//         // const now = Math.ceil(Date.now() / 1000);
//         // console.log(tokenParts.exp);

//         // if (tokenParts.exp > now) {
//         //     return
        
//         axiosInstance
//           .post(endpoints.refreshToken, { refreshToken: refreshToken })
//           .then((response) => {
//             const accessToken = response.data.accessToken
//             Cookie.set("accessToken", accessToken,{
//                 expires: new Date(new Date().getTime() + 1 * 60 * 1000)
//             });
//             // axiosInstance.defaults.headers['Authorization'] = "Bearer " + response.data.accessToken;
//             originalRequest.headers["Authorization"] =
//               "Bearer " + accessToken;

//             return axiosInstance(originalRequest);
//           })
//           .catch((err) => {
//             console.log(err);
//           });


//         // }else{
//         //     console.log("Refresh token is expired", tokenParts.exp, now);
//         //     window.location.href = '/login/';
//         // }
//       } else {
//         console.log("Refresh token not available.");
//         window.location.href = "/login/";
//       }
//       }catch(err){
//         console.log(err);
//       }
//     }

//     // specific error handling done elsewhere
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;