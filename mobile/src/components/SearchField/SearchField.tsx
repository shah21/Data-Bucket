import React from 'react'
import { View, Text, StyleSheet,TextInput } from 'react-native'
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

type propTypes = {
    placeHolder?:string,
    onTextChange:(val:string)=>void,
    onClearText?:()=>void
}

const defaultProps: propTypes = {
    placeHolder:'Search',
    onTextChange:undefined!,
}
const SearchField:React.FunctionComponent<propTypes> = ({placeHolder,onTextChange,onClearText}:propTypes)=> {

    const inputRef = React.useRef<TextInput>(null!);
    
    
    
    const clearText = () => {
        inputRef.current.clear();
        if(onClearText){
            onClearText();
        }
    }
    
    
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                ref={inputRef}
                onChangeText={onTextChange}
                placeholder={placeHolder}/>
            <MaterialIcon
                name="clear"
                onPress={clearText}
                size={20}
            /> 
        </View>
        
    )
}

SearchField.defaultProps = defaultProps;


const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        height:40,
        margin:10,
        borderColor:'#e2e2e2',
        backgroundColor:'#e2e2e2',
        borderRadius:20,
        borderWidth:1,
        paddingHorizontal:10,
        alignItems:'center',
        justifyContent:'space-between',
    },
    input:{
        width:'100%',
        flex:1,
    }
});


export default SearchField;