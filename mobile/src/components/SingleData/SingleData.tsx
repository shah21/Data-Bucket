import moment from 'moment'
import { Card, Item } from 'native-base'
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Data from '../../Models/data';

import Theme from "../../res/styles/theme.style";

type Props  = {
    item:Data,
}


const getType = (uri:string):string => {
    const urlParts = uri.split('/');
    const fileName = urlParts[urlParts.length -1];
    const nameParts = fileName.split('.');
    const imageTypes = ['jpg','jpeg','png','svg'];
    let type = nameParts[nameParts.length -2];;
    imageTypes.forEach(imgType=>{
        type  = imgType === type ? 'Image' : type;
    })
    return type;
}

const SingleData = ({item}:Props) => {
    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <View style={styles.content}>
                    <Text style={styles.headerText}>{item.deviceName}</Text>
                    <Text style={styles.timeText}> {moment(item.addedAt).fromNow()}</Text>
                   

                    {item.file_path !== null && (
                        <View style={styles.file}>
                            <MaterialCommunityIcons
                            size={40}
                            color="#6C6C6C"
                            name="file-download"/>

                            <View style={styles.fileTextView}>
                                <Text>{`${getType(item.file_path)} file`}</Text>
                                <Text style={styles.downloadText}>Download</Text>
                            </View>
                        </View>

                    )}

                    {item.data.length > 0 && (
                        <Text style={styles.data}>{item.data}</Text>
                    )}


                </View>
                <TouchableOpacity>
                    <MaterialCommunityIcons
                        size={23}
                        name="dots-vertical" />

                </TouchableOpacity>

            </Card>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        paddingLeft:10,
        paddingRight:10,
    },
    card:{
        padding:10,
        flexDirection:'row',
        justifyContent:'space-between',
    },
    content:{
        flex:1,
    },
    headerText:{
        color:Theme.PRIMARY_COLOR,
        fontSize:16,
    },
    timeText:{
        fontSize: 10,
        color:'#bbb',
    },
    data:{
        marginTop:10,
    },
    file:{
        marginTop:10,
        borderRadius:5,
        backgroundColor:'#E3E9E7',
        flexDirection:'row',
        padding:5,
    },
    fileTextView:{
        flex:1,
        justifyContent:'space-between',
    },
    downloadText:{
        color:'blue',
        textDecorationLine:'underline',
        fontSize:12,
        marginBottom:3,
    },
})

export default SingleData
