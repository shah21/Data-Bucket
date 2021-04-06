import React, { useState } from "react";
import { Button, Paragraph, Dialog, Portal } from 'react-native-paper';
import { FlatList, Pressable, StyleSheet, TextComponent, TextInput, View } from 'react-native';
import Theme from "../../res/styles/theme.style";
import { Body, ListItem, Text } from "native-base";
import strings from "../../res/strings/strings";
import { TouchableOpacity } from "react-native-gesture-handler";

type TypeProps = {
    modalVisible:boolean;
    closeModel:()=>void,
    chooseOption:(val:string)=>void,
    contentType:string,
    optionList:string[],
}


const OptionsDialog = ({ modalVisible, closeModel, chooseOption,contentType,optionList }: TypeProps) => {


    return (
        <View>
            <Portal>
                <Dialog style={styles.dialog} visible={modalVisible} onDismiss={closeModel}>
                    <FlatList data={optionList}  
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(item)=>{
                            if(contentType === 'file' && item.item === 'Copy'){
                                return null!;
                            }
                            return (
                                <ListItem noBorder onPress={()=>chooseOption(item.item)}>
                                    <Body><Text>{item.item}</Text></Body>                                    
                                </ListItem>
                            )
                        }}
                        />
                </Dialog>
            </Portal>
        </View>
    );
};

const styles = StyleSheet.create({
    dialog:{
        
    },
  modelItem:{
      paddingHorizontal:20,
      paddingVertical:10,
      fontSize:18,
  }
})

export default OptionsDialog;