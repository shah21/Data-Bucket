import React from 'react'
import { View, Text,StyleSheet } from 'react-native'

const style = StyleSheet.create({
  header:{
    height:50,
    backgroundColor:'#32be8f',
  }
});

export default function Header() {
  return (
    <View style={style.header}>
      <Text></Text>
    </View>
  )
}
