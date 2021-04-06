type StackProps = {
    SplashScreen:undefined,
    SignUpScreen:undefined,
    LoginScreen:undefined,
    RootStackScreen:undefined,
    HomeScreen:undefined,
    RoomScreen:{
        id:string,
    },
}

type FlashType = { message: string, type: string };

type AuthObjectType = {
    accessToken:string,
    refreshToken:string,
    userId:string,
}