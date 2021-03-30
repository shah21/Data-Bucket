type StackProps = {
    SplashScreen:undefined,
    SignUpScreen:undefined,
    LoginScreen:undefined,
    RootStackScreen:undefined,
    HomeScreen:undefined,
}

type FlashType = { message: string, type: string };

type AuthObjectType = {
    accessToken:string,
    refreshToken:string,
    userId:string,
}