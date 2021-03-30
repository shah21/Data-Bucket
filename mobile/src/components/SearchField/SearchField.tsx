import React from 'react'
import { View, Text, StyleSheet,TextInput } from 'react-native'
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
type propTypes = {
    placeHolder?:string,
}

const defaultProps: propTypes = {
    placeHolder:'Search'
}

const SearchField:React.FunctionComponent<propTypes> = ({placeHolder}:propTypes)=> {
    return (
        <View style={styles.container}>
            <TextInput
                placeholder={placeHolder}/>
            <MaterialIcon
                name="clear"
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
        borderColor:'#f3f3f3',
        borderBottomWidth:2,
        alignItems:'center',
        justifyContent:'space-between',
    }
});


export default SearchField;