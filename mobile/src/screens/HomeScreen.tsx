import React from 'react'
import { View, Text,Dimensions,StyleSheet,Image,TouchableOpacity, Pressable, FlatList, ScrollView, RefreshControl, Route, NativeScrollEvent } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as Animatable from "react-native-animatable";
import { StackNavigationProp } from "@react-navigation/stack";


import AuthContext from '../contexts/AuthContext';
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
import OptionsDialog from '../components/Dialogs/OptionsDialog';

type SplashNavigationProps = StackNavigationProp<
    StackProps,
    "SplashScreen"
>;

type TypeProps = {
    navigation: SplashNavigationProps,
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


const addBucket = async (userToken:any,body:object) =>{
    try {
        const isAuthourized = await isAuth(userToken.accessToken,userToken.refreshToken);
        if (isAuthourized && isAuthourized.isVerified) {
            
            const response = await axios.post(endpoints.createBucket,body, {
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


const deleteBucket = async (bucketId:string,token:any)=>{
    try {
        const isAuthourized = await isAuth(token.accessToken, token.refreshToken);
        if (isAuthourized && isAuthourized.isVerified) {
            const response = await axios.delete(endpoints.deleteBucket + bucketId,{
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${isAuthourized.accessToken}`,
                }
            });
            if (response) {
                return response;
            }
        }
    } catch (err) {
        throw err;
    }
}


export default function HomeScreen({navigation}:TypeProps) {

    const {signOut,token} = React.useContext(AuthContext);    

    const [buckets,setBuckets] = React.useState<Bucket[]>([]);
    const [modalVisible, setModalVisible] = React.useState<boolean>(false);
    const [optionsVisible, setOptionsVisible] = React.useState<boolean>(false);
    const [isRefreshing,setRefreshing] = React.useState<boolean>(false);
    const [totalCount,setTotalCount] = React.useState<number>(0);
    const [selectedId, setSelectedId] = React.useState<string>(null!);

    const currentPage = React.useRef<number>(1);
    const bucketsBackup = React.useRef<Bucket[]>([]);

    const {setFlash} = React.useContext(FlashContext);

    const LIMIT_PER_PAGE = 10;



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

    async function loadBuckets(){
        try{
            setRefreshing(true);
            const accessToken = await AsyncStorage.getItem('accessToken');
            const refreshToken = await AsyncStorage.getItem('refreshToken');

            const userToken = {
                accessToken,
                refreshToken
            }

            const response = await getBuckets(userToken,currentPage.current);
            if(response){
                setBuckets(response.buckets);
                bucketsBackup.current = response.buckets;
                setTotalCount(response.totalCount);
            }
            setRefreshing(false);
        }catch(err){
            setRefreshing(false);
           setFlash({message:err.message,type:'error'})
        }
    }
    
    

    React.useEffect(() => {
        updateStatusBar();
        loadBuckets();
    }, []);


    React.useEffect(()=>{

        async function setupSocket() {
    
            
            socket.emit('subscribe', token.userId);
            socket.on('bucket', (data: { action: string, bId: string, bucket: Bucket, socket_id: string }) => {

                switch (data.action) {
                    case 'bucket-created': {
                        if (data.socket_id !== socket.id) {
                            loadBuckets();
                        }
                        break;
                    }
                    case 'bucket-deleted': {
                        socket.emit('unsubscribe', data.bId);
                        // setBucketId(null!);
                        setBuckets(prev => prev.filter(bucket => bucket._id !== data.bId));
                        bucketsBackup.current = bucketsBackup.current.filter(bucket => bucket._id !== data.bId);
                        // if (data.socket_id === socket.id) {
                        //     setFlash({ message: `Bucket deleted successfully`, type: 'success' });
                        // }
                        setFlash({ message: `Bucket deleted successfully`, type: 'success' });
                        setTotalCount(prev => prev - 1);
                        break;
                    }
                }

            });
            }


        setupSocket();    
        
        return ()=>{
            socket.off('subscribe');
            socket.off('unsubscribe');
            socket.off('bucket');
        }
    },[]);

    const onSearchTextChange = (text:string) => {
        setBuckets(bucketsBackup.current);
        if(text){
            setBuckets(prev=>prev.filter(x=>x.name.toLowerCase().includes(text.toLowerCase())));
            if(buckets.length === 0){
                return;
            }
        }
    }

    const handleAdd = async (val:string) => {
        try{
            const accessToken = await AsyncStorage.getItem('accessToken');
            const refreshToken = await AsyncStorage.getItem('refreshToken');

            const userToken = {
                accessToken,
                refreshToken
            }
            const body:{name:string} = {name:val};
            const response = await addBucket(userToken,body);
            if(response){
                setFlash({message:`${val} bucket created`,type:'error'})
                setModalVisible(false);
            }
        }catch(err){
            if (err.response && err.response.status !== 401) {
                const error = err.response.data.errors[0];
                if (error) {
                    setFlash({ message: error.msg, type: 'error' });
                } else {
                    setFlash({ message: err.message, type: 'error' });
                }
            }
            setModalVisible(false);
        }
    }

    const onRefresh = () => {
        setRefreshing(true);
        loadBuckets();
    }
    
    const onClick = (id:string) => {
        navigation.navigate('RoomScreen',{
            bucketId:id,
        });
    }
    
    
    
    const onLongPress = (id:string) => {
        setSelectedId(id);
        setOptionsVisible(true);
    }


    const handleOptions =  async (option:string) => {
        switch(option){
            case 'Delete':
                try{
                    await deleteBucket(selectedId,token);
                    setOptionsVisible(false);
                }catch(err){
                    setFlash({message:err.message,type:'error'});
                }
            default:
                return;
                
        }
    }

    const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}:NativeScrollEvent) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >=
          contentSize.height - paddingToBottom;
      };

    const onScroll = (nativeEvent:NativeScrollEvent) => {
        if (!isRefreshing && isCloseToBottom(nativeEvent)) {
            loadMoreData();
        }    
    }

    const loadMoreData = async () =>{
        if(totalCount > LIMIT_PER_PAGE * currentPage.current){
            setRefreshing(true);
            currentPage.current = ++currentPage.current; 
            const responseData = await getBuckets(token,currentPage.current);
            if (responseData) {
                setTotalCount(responseData.totalCount);
                const array = [...buckets, ...responseData.buckets];
                setBuckets(array);
                bucketsBackup.current = array;
            }
        }
        setRefreshing(false);
    }


    return (
        <View style={styles.container}>
            <SearchField 
                onClearText={()=> setBuckets(bucketsBackup.current)}
                onTextChange={onSearchTextChange}  
                placeHolder="Search bucket"/>
            

            {buckets.length !== 0 ? <FlatList 
                onScroll={({nativeEvent})=>onScroll(nativeEvent)}
                refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            } data={buckets} keyExtractor={(item, index) => index.toString()} renderItem={(item) => {
                return (<BucketItem onLongPress={onLongPress} onClick={onClick} item={item.item} />)
            }} /> : ( <Text style={styles.emptyText}>No buckets found !</Text> )}
                

            
            <Fab
                direction="up"
                containerStyle={{}}
                style={{ backgroundColor: Theme.PRIMARY_COLOR }}
                onPress={()=>setModalVisible(true)}
                position="bottomRight">
                    <MaterialIcons name="add" />
            </Fab>

            <AddBucketDialog 
                modelInputLabel="Bucket Name"
                modelTitle="Add Bucket"
                handleDone={handleAdd}
                modelBtnLabel="Save"
                closeModel={()=>setModalVisible(false)} 
                modalVisible = {modalVisible}/>

            <OptionsDialog
                    optionList={["Rename","Delete"]}
                    closeModel={() => setOptionsVisible(false)}
                    chooseOption={handleOptions}
                    contentType="text"
                    modalVisible={optionsVisible} />

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
    },
    emptyText:{
        flex:1,
        textAlign:'center',
        color:'grey',
        fontSize:16,
        marginTop:20,
    }
});
