
enum endpoints {
    login = '/auth/login',
    refreshToken = '/auth/refresh-token',
    getUser = '/auth/user/',
    signup = '/auth/signup',
    sendResetMail = '/auth/send-reset-mail',
    createBucket = '/bucket/create',
    verifyAccessToken = '/auth/verifyAccessToken',
    getBuckets = '/bucket',
    getBucket = '/bucket/',
    addData = '/bucket/add-data',
    deleteData = '/bucket/delete-data/?',
    deleteBucket = '/bucket/delete-bucket/',
    resetPassword = '/auth/reset-password'
};

export default endpoints;