import React, { useState } from "react";
import { Button, Paragraph,ProgressBar, Dialog, Portal, Colors } from 'react-native-paper';
import { FlatList, Pressable, StyleSheet, Text, TextComponent, TextInput, View } from 'react-native';
import Theme from "../../res/styles/theme.style";
import strings from "../../res/strings/strings";
import { TouchableOpacity } from "react-native-gesture-handler";

type TypeProps = {
    modalVisible:boolean;
    closeModel:()=>void,
    progress:number,
}


const ProgressDialog = ({ modalVisible, closeModel,progress }: TypeProps) => {


    return (
        <View>
            <Portal>
                <Dialog style={styles.dialog} visible={modalVisible} dismissable={false}>
                    <Dialog.Title style={styles.modelTitle}>Upload File</Dialog.Title>
                    <Dialog.Content>
                        <ProgressBar progress={progress/100} color={Colors.blue400} />
                        <Text style={styles.progressText}>{`${progress}% completed`}</Text>
                    </Dialog.Content>

                </Dialog>
            </Portal>
        </View>
    );
};

const styles = StyleSheet.create({
    dialog:{
        // height:100,
        // backgroundColor:Colors.white,
        // justifyContent:'center',
        // paddingHorizontal:10,
    },
    modelTitle:{
        fontSize:16,
    },
    progressText:{
        fontSize:14,
        fontWeight:'bold',
        alignSelf:'flex-end',
        paddingVertical:10,
    }
})

export default ProgressDialog;