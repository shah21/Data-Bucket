import React from 'react'
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native'
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import * as Animatable from "react-native-animatable";

interface PropsType{
    handleChange:(val:string,fieldName:string)=>void;
    errorText:string,
    label:string,
    name:string,
}

export default function PasswordField({handleChange,errorText,label,name}:PropsType) {
    
    const [isFilled,setFilledStatus] = React.useState<boolean>(false);
    const fieldName = React.useRef<string>(name);

    const handleTextChange = (val:string) => {
        handleChange(val,fieldName.current);
        if(val.length === 0){
            setFilledStatus(false)
            return;
        }
        setFilledStatus(true);
    }
    
    
    return (
        <View style={styles.field}>
            <Text style={[styles.text_footer, { marginTop: 35 }]}>{label}</Text>
            <View style={styles.action}>
                <FontAwesome
                    name="user-o"
                    color="#05375a"
                    size={20} />

                <TextInput
                    onChangeText={(val) => handleTextChange(val)}
                    placeholder="Your Email"
                    style={styles.textInput}
                    autoCapitalize="none"
                />

                {isFilled ?
                    (

                        <Animatable.View
                            animation="bounceIn">
                            <Feather
                                name="check-circle"
                                color="green"
                                size={20} />
                        </Animatable.View>



                    ) : null}
            </View>
            {console.log(errorText)}
            {errorText !== null ? (
                <Text style={styles.textError}>{errorText}</Text>
            ) : null}
        </View>
    )
}


const styles = StyleSheet.create({
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    field:{
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textError:{
        fontSize:10,
        color:'red',
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        paddingHorizontal:5,
        fontWeight: 'bold',
    }
});
