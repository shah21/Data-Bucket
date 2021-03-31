import React from 'react'
import { View, Text,Dimensions,StyleSheet,Image,TouchableOpacity, Pressable, FlatList } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as Animatable from "react-native-animatable";
import { StackNavigationProp } from "@react-navigation/stack";


import { AuthContext } from '../contexts/context';
import SearchField from '../components/SearchField/SearchField';
import Theme from "../res/styles/theme.style";
import BucketItem from "../components/ListItems/BucketItem";
import isAuth from '../utils/isAuth';
import axios from '../axios/config';
import endpoints from '../axios/endpoints';
import Bucket from '../Models/bucket';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fab } from 'native-base';

type SplashNavigationProps = StackNavigationProp<
    StackProps,
    "SplashScreen"
>;

type TypeProps = {
    navigation: SplashNavigationProps
}

const getBuckets = async (userToken:any,page:number) =>{
    try {
        const isAuthourized = await isAuth(userToken.accessToken,userToken.refreshToken);
        if (isAuthourized && isAuthourized.isVerified) {
            
            const response = await axios.get(endpoints.getBuckets + `/?page=${page}`, {
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${isAuthourized.accessToken}`,
                }
            });
            if(response){
                return response.data;
            }
        }
    } catch (err) {
        console.log(err)
        throw err;
    }

}        


export default function HomeScreen({navigation}:TypeProps) {

    const {signOut} = React.useContext(AuthContext);
    const [buckets,setBuckets] = React.useState<Bucket[]>([]);
    const currentPage = React.useRef<number>(1);


    const updateStatusBar = () => {
        navigation.setOptions({
            headerRight:()=>(
                <TouchableOpacity>
                <MaterialIcons
                    onPress={signOut}
                    style={{padding:10}} 
                    name="logout"
                    color={Theme.WHITE}
                    size={25}/>
                </TouchableOpacity>    
            )
        })
    }
    
    

    React.useEffect(() => {
        updateStatusBar();
        async function loadBuckets(){
            try{
                const accessToken = await AsyncStorage.getItem('accessToken');
                const refreshToken = await AsyncStorage.getItem('refreshToken');

                const userToken = {
                    accessToken,
                    refreshToken
                }

                const response = await getBuckets(userToken,currentPage.current);
                if(response){
                    setBuckets(response.buckets);
                }
            }catch(err){
               
            }
        }
        loadBuckets();
    }, [])


    const onSearchTextChange = (val:string) => {
        console.log(val);
    }

    const openCreateDialog = () => {
        
    }
    
    


    return (
        <View style={styles.container}>
            <SearchField onTextChange={onSearchTextChange}  placeHolder="Search bucket"/>
            <FlatList data={buckets} keyExtractor={(item, index) => index.toString()} renderItem={(item)=>{
                return (<BucketItem item={item.item} />)
            }} />

            
            <Fab
                direction="up"
                containerStyle={{}}
                style={{ backgroundColor: Theme.PRIMARY_COLOR }}
                onPress={openCreateDialog}
                position="bottomRight">
                    <MaterialIcons name="add" />
            </Fab>
        </View>
    )
}

const { height } = Dimensions.get('screen');
const height_logo = height * 0.28;

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    footer:{
        flex:1,
        backgroundColor:'#fff',
        borderTopLeftRadius:30,
        borderTopRightRadius:30,
        paddingVertical:50,
        paddingHorizontal:30,
    },
    header:{
        flex:2,
        justifyContent:'center',
        alignItems:'center',
    },
    logo:{
        width:height_logo,
        height:height_logo,
    },
    title:{
        color:'#05375a',
        fontSize:30,
        fontWeight:'bold',
    },
    text:{
        color:'grey',
        marginTop:5,
    },
    signIn:{
        width:150,
        height:40,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:50,
        flexDirection:'row',
    },
    textSign: {
        color: 'white',
        fontWeight: 'bold'
    },
    button:{
        alignItems:'flex-end',
        marginTop:30,
    }
});
