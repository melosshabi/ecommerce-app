import { Dimensions, Image, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native'
import React from 'react'
import colors from '../lib/colors'
import { useNavigation } from '@react-navigation/native'

const screen = Dimensions.get("screen")
const dvw = screen.width
export default function Footer({currentScreen}:Footer) {
    const darkMode = useColorScheme() == 'dark'
    const navigation = useNavigation()
return (
    <View style={[styles.footer, darkMode ? {backgroundColor:colors.black, shadowColor:'white', borderTopColor:colors.transparentWhite,} : {backgroundColor:'white', shadowColor:'black', borderTopColor:colors.black3,}]}>
        {/* @ts-ignore */}
        <Pressable onPress={() => navigation.navigate("Home")} style={({pressed}) => [styles.buttons, {marginLeft:5}, pressed && darkMode ? {backgroundColor:colors.transparentWhite} : pressed && {backgroundColor:colors.black3}, currentScreen === 'Home' && darkMode ? {backgroundColor:colors.transparentWhite} : currentScreen === "Home" && {backgroundColor:colors.black3}]}>
            <Image style={[styles.icons]} source={darkMode ? require("../images/home.png") : require('../images/homeBlack.png')}/>
        </Pressable>
        {/* @ts-ignore */}
        <Pressable onPress={() => navigation.navigate("Search")} style={({pressed}) => [styles.buttons, pressed && darkMode ? {backgroundColor:colors.transparentWhite} : pressed && {backgroundColor:colors.black3}, currentScreen === 'Search' && darkMode ? {backgroundColor:colors.transparentWhite} : currentScreen === "Search" && {backgroundColor:colors.black3}]}>
            <Image style={[styles.icons]} source={darkMode ? require("../images/magnifyingGlass.png") : require('../images/magnifyingGlassBlack.png')}/>
        </Pressable>
        {/* @ts-ignore */}
        <Pressable onPress={() => navigation.navigate("Cart")} style={({pressed}) => [styles.buttons, pressed && darkMode ? {backgroundColor:colors.transparentWhite} : pressed && {backgroundColor:colors.black3}, currentScreen === 'Cart' && darkMode ? {backgroundColor:colors.transparentWhite} : currentScreen === 'Cart' && {backgroundColor:colors.black3}]}>
            <Image style={styles.icons} source={darkMode ? require("../images/cart.png") : require("../images/cartBlack.png")}/>
        </Pressable>

        <Pressable style={({pressed}) => [styles.buttons, {marginRight:5}, pressed && darkMode ? {backgroundColor:colors.transparentWhite} : pressed && {backgroundColor:colors.black3}]}>
            <Image style={[styles.icons]} source={darkMode ? require("../images/user.png") : require("../images/userBlack.png")}/>
        </Pressable>
    </View>
)}

const styles = StyleSheet.create({
    footer:{
        width:dvw,
        height:'8%',
        flexDirection:'row',
        elevation:4,
        justifyContent:'space-between',
        alignItems:'center',
        borderTopWidth:1,
    },
    buttons:{
        width:60,
        height:45,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:8,
    },
    icons:{
        // transform:[{scale:.47}]
        width:35,
        height:35
    }
})