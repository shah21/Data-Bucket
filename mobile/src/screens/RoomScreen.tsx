import React from 'react'
import { View, Text,Dimensions,StyleSheet, FlatList,  RefreshControl, TextInput, Platform, PermissionsAndroid, Image } from 'react-native'
import { RouteProp } from '@react-navigation/native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { StackNavigationProp } from "@react-navigation/stack";
import DocumentPicker from 'react-native-document-picker';
import { IconButton } from 'react-native-paper';


import { AuthContext } from '../contexts/context';
import Theme from "../res/styles/theme.style";
import isAuth from '../utils/isAuth';
import axios from '../axios/config';
import endpoints from '../axios/endpoints';
import Bucket from '../Models/bucket';
import { FlashContext } from '../contexts/FlashContext';
import { socket } from '../utils/socket';
import Data from '../Models/data';
import SingleData from '../components/SingleData/SingleData';
import OptionsDialog from '../components/Dialogs/OptionsDialog';
import ProgressDialog from '../components/Dialogs/ProgressDialog';
import RNFetchBlob from 'rn-fetch-blob';

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

const checkPermission = async () => {
 
    if (Platform.OS === 'ios') {
      return true;
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'Application needs access to your storage to download File',
              buttonPositive:null!,
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Storage Permission Granted.');
          // Start downloading
          return true;
        } else {
          // If permission denied then show alert
        //   Alert.alert('Error','Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.log("++++"+err);
      }
    }
  };

const downloadFile = async (bucketId:string,userToken:any,dataId:string,onProgress:(progress:number)=>void) =>{
    
    
    try {
        const isAuthourized = await isAuth(userToken.accessToken, userToken.refreshToken);
        if (isAuthourized && isAuthourized.isVerified) {
            const dirs = RNFetchBlob.fs.dirs
            const res = await RNFetchBlob
                .config({
                    path: dirs.DocumentDir + `/123.png`
                })
                .fetch('GET', 'http://192.168.1.5:8080'+endpoints.getBucket + `${bucketId}/data/${dataId}`, {
                    "Content-type": "multipart/form-data",
                    "Authorization": `Bearer ${isAuthourized.accessToken}`,
                });
            return res.path();
        }
    } catch (err) {
        console.log(err.message);
    }



}


const deleteData = async (dataId:string,bucketId:string,token:any)=>{
    try {
        const isAuthourized = await isAuth(token.accessToken, token.refreshToken);
        if (isAuthourized && isAuthourized.isVerified) {
            const response = await axios.delete(endpoints.deleteData + `dataId=${dataId}&bucketId=${bucketId}`,{
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





export default function HomeScreen({route,navigation}:TypeProps) {

    /* Params */
    const {bucketId} = route.params;

    const {signOut,getToken} = React.useContext(AuthContext);
    
    const [isRefreshing,setRefreshing] = React.useState<boolean>(false);
    const [totalCount,setTotal] = React.useState<number>(0);
    const [bucket,setBucket] = React.useState<Bucket>(null!);
    const [dataArray,setDataArray] = React.useState<Data[]>([]);
    const [text,setText] = React.useState<string>(null!);
    const [modalVisible, setModalVisible] = React.useState<boolean>(false);
    const [selectedId, setSelectedId] = React.useState<string>(null!);
    const [uploadProgress,setUploadProgress] = React.useState<number>(0);
    const [uploadState,setUploadState] = React.useState<boolean>(false);

    const currentPage = React.useRef<number>(1);
    const inputRef = React.useRef<TextInput>(null!);
    

    const {setFlash} = React.useContext(FlashContext);

    


    const updateStatusBar = (title:string) => {
        navigation.setOptions({
            title:title,
            headerRight:()=>(
                <IconButton  
                    onPress={selectFile}
                    icon={()=>(
                    <MaterialIcons
                    style={styles.iconAttach}
                    name="attach-file"
                    color={Theme.WHITE}
                    /> 
                )}/>
                   
            )
        })
    }


    const selectFile = async () => {
        try {
            const userToken = await getToken();
            const res = await DocumentPicker.pick({
                type: ['image/*', '.pdf', '.mp4'],
            });

            if(res){
                setUploadState(true);
                setUploadProgress(0);
                const response = await addData(bucketId,userToken,'',res,(progress:number)=>{
                    setUploadProgress(progress);
                });
    
                if(response){
                    setUploadState(false);
                }
            }
            
           
            
        } catch (err) {
            if(err.response){
                let errMessage = err.response.data.message;
                if(errMessage === 'File too large!'){
                    errMessage += '.Pick another one' 
                }
                setFlash({message:errMessage,type:'error'});
            }else{
                setFlash({message:err.message,type:'error'});
            }
            setUploadState(false);
        }
    }
    

    async function loadData(){
        try{
            setRefreshing(true);
            const userToken = await getToken();
            const response = await getBucket(bucketId,userToken);
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
            const response = await getBucket(bucketId,userToken);
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
            if(dataArray.length === 0 || bucketId){
                setRefreshing(true);
                const userToken = await getToken();
                const response = await getDataArray(bucketId, userToken,currentPage.current);
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

            socket.emit('subscribe', bucketId);
            socket.on('data', (data: { action: string, data: Data, bId: string, id: string }) => {
                
                //check if it is correct bucket/room
                if (data.bId === bucketId) {
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

        setupSocket();    

        return  ()=>{
            socket.off('subscribe');
            socket.off('data');
        }
    },[]);

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    }

    
    
    const handleSend = async () =>{
        if(text){
            try {
                const userToken = await getToken();
                const response = await addData(bucketId,userToken,text,null!,(progress:number)=>{

                });
                if(response){
                    inputRef.current.clear();
                }
            } catch (err) {
                setFlash({message:err.message,type:'error'});
            }
        }
    } 

    const handleOptions =  async (option:string) => {
        switch(option){
            case 'Delete':
                try{
                    const userToken = await getToken();
                    await deleteData(selectedId,bucketId,userToken);
                    setModalVisible(false);
                }catch(err){
                    setFlash({message:err.message,type:'error'});
                }
            default:
                return;
                
        }
    }

    const openOptions = (id:string) => {
        setSelectedId(id);
        setModalVisible(true);    
    }
    

    
    const handleDownloadFile = async (id: string) => {
        if (checkPermission()) {
            // setDonwloadProgress(0);
            // setDownloadStart(true);
            const userToken = await getToken();
            await downloadFile(bucketId, userToken, id, (percent: number) => {
                // setDonwloadProgress(percent);
                if (percent === 100) {
                    // setDownloadStart(false);
                }
            });
        }
    }

    


    return (
        <View style={styles.container}>
            <View>
                {dataArray.length !== 0 ? <FlatList refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
                } data={dataArray} keyExtractor={(item, index) => index.toString()} renderItem={(item) => {
                    return (<SingleData downloadFile={handleDownloadFile} openOptions={openOptions} item={item.item} />)
                }} /> : (<Text style={styles.emptyText}>No data found !</Text>)}
            </View>
            
            <View style={styles.sendContainer}>
                <TextInput
                    ref={inputRef}
                    onChangeText={(val) => setText(val)}
                    placeholder="Enter here"
                    style={styles.inputField} />
                <IconButton
                    onPress={handleSend}
                    size={30}
                    style={styles.btnSend}
                    icon={() => (
                        <MaterialIcons
                            size={20}
                            color={Theme.WHITE}
                            name="send"
                        />
                    )} />

                <OptionsDialog
                    optionList={["Copy","Delete","Favourite"]}
                    closeModel={() => setModalVisible(false)}
                    chooseOption={handleOptions}
                    contentType="text"
                    modalVisible={modalVisible} />

                <ProgressDialog 
                    modalVisible={uploadState}
                    closeModel={() => setUploadState(false)}
                    progress={uploadProgress} />


            

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
    },
    iconAttach:{
        color:Theme.WHITE,
        fontSize:23,
    }
    
});