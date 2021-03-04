
enum endpoints {
    login = '/auth/login',
    refreshToken = '/auth/refresh-token',
    getUser = '/auth/user/',
    signup = '/auth/signup',
    createBucket = '/bucket/create',
    verifyAccessToken = '/auth/verifyAccessToken',
    getBuckets = '/bucket',
    getBucket = '/bucket/',
    addData = '/bucket/add-data',
    deleteData = '/bucket/delete-data/'
};

export default endpoints;