import React from 'react'
// import { StyleSheet, View,Image,Text } from 'react-native'
import { ListItem,Left, Thumbnail, Right,Text, Body, Image } from "native-base";


import Theme from "../../res/styles/theme.style";

type TypeProps = {
    item:any
}


export default function BucketItem({item}:TypeProps) {
    return (
        <ListItem>
            <Left style={{flex:0.2}}>
                <Thumbnail square source={require("../../res/images/folder.jpg")}/>
            </Left>
            <Body style={{flex:0.7}}>
                <Text style={{fontSize:Theme.FONT_SIZE_LARGE,}}>{item.name}</Text>
                <Text note>{new Date(item.createdAt).toISOString().split('T')[0]}</Text>
            </Body>
        </ListItem>
    )
}




