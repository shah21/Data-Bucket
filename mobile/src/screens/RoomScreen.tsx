import React from 'react'
import { View, Text,Dimensions,StyleSheet,Image,TouchableOpacity, Pressable, FlatList, ScrollView, RefreshControl, TextInput, Platform } from 'react-native'
import { RouteProp } from '@react-navigation/native';
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
import AddBucketDialog from '../components/Dialogs/AddBucketDialog';
import { FlashContext } from '../contexts/FlashContext';
import { socket } from '../utils/socket';
import Data from '../Models/data';
import SingleData from '../components/SingleData/SingleData';
import { IconButton } from 'react-native-paper';

type SplashNavigationProps = StackNavigationProp<
    StackProps,
    "SplashScreen"
>;

type ProfileScreenRouteProp = RouteProp<StackProps,'RoomScreen'>;


type TypeProps = {
    navigation: SplashNavigationProps,
    route:ProfileScreenRouteProp,
}

const getBucket = async (bucketId:string,userToken:any) =>{    
    try {
        const isAuthourized = await isAuth(userToken.accessToken,userToken.refreshToken);
        if (isAuthourized && isAuthourized.isVerified) {
            const response = await axios.get(endpoints.getBucket + bucketId, {
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${isAuthourized.accessToken}`,
                }
            });
            if(response){
                return response.data.bucket;
            }
        }
    } catch (err) {
        throw err;
    }

}    

const getDataArray = async (bucketId:string,userToken:any,page:number) =>{
    try {
        const isAuthourized = await isAuth(userToken.accessToken,userToken.refreshToken);
        if (isAuthourized && isAuthourized.isVerified) {
            const response = await axios.get(endpoints.getBucket + bucketId +`/data?page=${page}`, {
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
        throw err;
    }

}      




const addData = async (bucketId:string,userToken:any,text:string,file:any,progressListener:(progress:number)=>void) =>{
    try {
        const isAuthourized = await isAuth(userToken.accessToken,userToken.refreshToken);
        if (isAuthourized && isAuthourized.isVerified) {
           
            //setting form data for multipart/form 
            const formData = new FormData();
            formData.append('text',text);
            formData.append('deviceName',Platform.OS);
            formData.append('bucketId',bucketId);
            formData.append('file',file);


            const response = await axios.post(endpoints.addData,formData, {
                headers: {
                    "Content-type": "multipart/form-data",
                    "Authorization": `Bearer ${isAuthourized.accessToken}`,
                },
                onUploadProgress:(progressEvent:ProgressEvent)=>{
                    let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    progressListener(percentCompleted);
                }
            });
            if(response){
                return response;
            }
        }
    } catch (err) {
        throw err;
    }
}


export default function HomeScreen({route,navigation}:TypeProps) {

    /* Params */
    const {id} = route.params;

    const {signOut,getToken} = React.useContext(AuthContext);
    
    const [isRefreshing,setRefreshing] = React.useState<boolean>(false);
    const [totalCount,setTotal] = React.useState<number>(0);
    const [bucket,setBucket] = React.useState<Bucket>(null!);
    const [dataArray,setDataArray] = React.useState<Data[]>([]);
    const [text,setText] = React.useState<string>(null!);

    const currentPage = React.useRef<number>(1);
    const bucketsBackup = React.useRef<Bucket[]>([]);
    

    const {setFlash} = React.useContext(FlashContext);



    const updateStatusBar = (title:string) => {
        navigation.setOptions({
            title:title,
            headerRight:()=>(
                <TouchableOpacity>
                
                </TouchableOpacity>    
            )
        })
    }

    async function loadData(){
        try{
            setRefreshing(true);
            const userToken = await getToken();
            const response = await getBucket(id,userToken);
            if(response){
                setBucket(response);
                updateStatusBar(response.name);
            }
            setRefreshing(false);
        }catch(err){
            setRefreshing(false);
           setFlash({message:err.message,type:'error'})
        }
    }

    async function loadBucket(){
        try{
            setRefreshing(true);
            const userToken = await getToken();
            const response = await getBucket(id,userToken);
            if(response){
                setBucket(response);
                updateStatusBar(response.name);
            }
            setRefreshing(false);
        }catch(err){
            setRefreshing(false);
           setFlash({message:err.message,type:'error'})
        }
    }

    async function promiseList(){
        try {
            //run only dataArray is empty or bucket id changed
            if(dataArray.length === 0 || id){
                setRefreshing(true);
                const userToken = await getToken();
                const response = await getDataArray(id, userToken,currentPage.current);
                if (response) {
                    setTotal(response.totalCount);
                    setDataArray(response.bucket.data ? response.bucket.data : []);
                    // setScrolling(false);
                }
                // setLoading(false);
            }else{
                setDataArray(dataArray);   
            }
               
        } catch (err) {
           console.log(err);
           setRefreshing(false); 
        }
    }
    


    React.useEffect(()=>{

        loadBucket();
        promiseList();
        async function setupSocket() {

            const userToken = await getToken();
            socket.emit('subscribe', id);
            socket.on('data', (data: { action: string, data: Data, bId: string, id: string }) => {
                //check if it is correct bucket/room
                if (data.bId === id) {
                    switch (data.action) {
                        case 'created': {
                            setDataArray(prev => [...prev, data.data]);
                            setText('');
                            // contentRef && updateScroll(contentRef.current);
                            break;
                        }
                        case 'deleted': {
                            setDataArray(prev => {
                                return prev.filter(item => {
                                    return item._id !== data.id;
                                });
                            });
                            setFlash({ message: `Data deleted successfully !`, type: 'success' });
                            setTotal(prev => prev - 1);
                            break;
                        }
                    }
                }

            });

        }

        return  ()=>{
            socket.off('subscribe');
            socket.off('unsubscribe');
            socket.off('data');
        }


        setupSocket();    
    },[]);

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    }
    
    const onClick = (id:string) => {
        navigation.navigate('RoomScreen',{
            id:id,
        });
    }
    
    
    const handleSend = async () =>{
        if(text){
            try {
                const userToken = await getToken();
                const response = await addData(id,userToken,text,null!,(progress:number)=>{

                });
                if(response){
                    
                }
            } catch (err) {
                setFlash({message:err.message,type:'error'});
            }
        }
    } 
    


    return (
        <View style={styles.container}>
            <View>
            {dataArray.length !== 0 ? <FlatList refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            } data={dataArray} keyExtractor={(item, index) => index.toString()} renderItem={(item) => {
                return (<SingleData item={item.item} />)
            }} /> : ( <Text style={styles.emptyText}>No data found !</Text> )}
            </View>
            
            <View style={styles.sendContainer}>
                <TextInput 
                onChangeText={(val)=>setText(val)}
                placeholder="Enter here"
                style={styles.inputField}/>
                <IconButton 
                onPress={handleSend}
                size={30}
                style={styles.btnSend}
                icon={()=>(
                    <MaterialIcons
                    color={Theme.WHITE}
                        name="send"
                        />
                )}/>
            </View>
        
        </View>
    )
}

const { height } = Dimensions.get('screen');
const height_logo = height * 0.28;

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'space-between',
    },
    emptyText:{
        flex:1,
        textAlign:'center',
        color:'grey',
        fontSize:16,
        marginTop:20,
    },
    sendContainer:{
        height:60,
        backgroundColor:Theme.WHITE,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingVertical:8,
        elevation:10,
    },
    btnSend:{
        marginHorizontal:10,
        backgroundColor:Theme.PRIMARY_COLOR_DARK,
    },
    inputField:{
        flex:1,
        borderRadius:5,
        borderWidth:1,
        borderColor:Theme.PRIMARY_COLOR_DARK,
        marginLeft:10,
        paddingHorizontal:10,
    }
    
});
