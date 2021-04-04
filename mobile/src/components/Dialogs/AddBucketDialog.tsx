import React, { useState } from "react";
import { Button, Paragraph, Dialog, Portal } from 'react-native-paper';
import { StyleSheet, TextComponent, TextInput, View } from 'react-native';
import Theme from "../../res/styles/theme.style";
import { Text } from "native-base";
import strings from "../../res/strings/strings";

type TypeProps = {
    modalVisible:boolean;
    closeModel:()=>void,
    modelTitle:string,
    modelInputLabel:string,
    modelBtnLabel:string,
    handleDone:(val:string)=>void
}


const AddBucketDialog = ({modalVisible,closeModel,handleDone,modelBtnLabel,modelInputLabel,modelTitle}:TypeProps) => {
  
  const [value,setValue] = React.useState<string>(null!);
  const [error,setError] = React.useState<string>(null!);

  const handleText = (val:string) => {
      if(val.length === 0){
        setError(strings.FIELD_EMPTY);
        return;
      }
      setError(null!);
      setValue(val);
  }
  

  const addValue = () => {
    if(!value){
      setError(strings.FIELD_EMPTY);
      return;
    }
    handleDone(value);
  }

  return (
    <View>
      <Portal>
        <Dialog visible={modalVisible} onDismiss={closeModel}>
          <Dialog.Title>{modelTitle}</Dialog.Title>
          <Dialog.Content>
            
            <TextInput
              onChangeText={(val)=>handleText(val)}
              style={[styles.modelInput,{
                borderBottomColor:!error ? Theme.PRIMARY_COLOR : Theme.ERROR,
              }]}
              placeholder={modelInputLabel}
            />

            {error && (<Text style={styles.modelError}>
                {error}
              </Text>
            )}
          
          </Dialog.Content>
          <Dialog.Actions>

          <Button 
              color={Theme.BLACK} 
              onPress={closeModel}>
                Cancel
              </Button>  

            <Button 
              color={Theme.PRIMARY_COLOR_DARK} 
              onPress={addValue}>
                {modelBtnLabel}
              </Button>

            

          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  modelInput:{
    borderBottomWidth:2,
  },
  modelBtn:{
    color:Theme.PRIMARY_COLOR_DARK,
  },
  modelError:{
    fontSize:12,
    color:Theme.ERROR,
  }
})

export default AddBucketDialog;