import { Pressable, StyleSheet, useColorScheme, View } from 'react-native'
import React from 'react'
import colors from '../lib/colors'
import { DrawerActions, useNavigation } from '@react-navigation/native'

export default function HamburgerButton() {
    const scheme = useColorScheme()
    const navigation = useNavigation()
return ( 
    <Pressable onPress={() => navigation.dispatch(DrawerActions.openDrawer())} style={({pressed}) => [styles.wrapper, pressed && scheme === 'dark' ? {backgroundColor:colors.transparentWhite} : pressed && {backgroundColor:colors.black3}]}>
        <View style={[styles.lines, styles.line1, scheme === "dark" ? {backgroundColor:'white'} : {backgroundColor:"#222222"}]}></View>
        <View style={[styles.lines, styles.line2, scheme === "dark" ? {backgroundColor:'white'} : {backgroundColor:"#222222"}]}></View>
        <View style={[styles.lines, styles.line3, scheme === "dark" ? {backgroundColor:'white'} : {backgroundColor:"#222222"}]}></View>
    </Pressable>
)}

const styles = StyleSheet.create({
    wrapper:{
        maxHeight:40,
        maxWidth:45,
        flex:1,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'flex-end',
        marginRight:10,
        padding:6,
        borderRadius:6
    },
    lines:{
        height:2,
        marginVertical:4
    },
    line1:{
        width:'100%'
    },
    line2:{
        width:'75%'
    },
    line3:{
        width:"50%"
    }
})