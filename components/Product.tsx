import { Image, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native'
import React from 'react'
import colors from '../lib/colors'
import { useNavigation } from '@react-navigation/native'
import { addToCart, addToWishlist } from '../lib/lib'

export default function Product({_id, picture, name, price, animationFunction}:ProductProps) {
    const darkMode = useColorScheme() === 'dark'
    const navigation = useNavigation()

return (
    // @ts-ignore
    <Pressable onPress={() => navigation.navigate("ProductDetails", {_id})} style={[styles.product, darkMode ? {backgroundColor:colors.black, shadowColor:"white"} : {backgroundColor:'white', shadowColor:colors.black}]}>
        <Image style={styles.productImage} source={{uri:picture}}/>
        <Text style={[styles.productText, darkMode ? {color:'white'} : {color:'black'}]}>{name}</Text>
        <Text style={[styles.productText, darkMode ? {color:'white'} : {color:'black'}]}>{price}€</Text>
        <View style={styles.actionButtonsWrapper}>
            <Pressable onPress={async () => {
                const added = await addToCart(_id, 1)
                if(added){
                    animationFunction("Cart")
                }
            }} style={({pressed}) => [styles.actionButtons, darkMode ? {backgroundColor:colors.transparentWhite} : !darkMode ? {backgroundColor:colors.black3} : {}, pressed && {opacity:.7}]}><Image style={styles.actionButtonIcons} source={darkMode ? require("../images/cart.png") : require("../images/cartBlack.png")}/></Pressable>
            <Pressable onPress={async () => {
                const added = await addToWishlist(_id)
                if(added){
                    animationFunction("Wishlist")
                }
            }} style={({pressed}) => [styles.actionButtons, darkMode ? {backgroundColor:colors.transparentWhite} : !darkMode ? {backgroundColor:colors.black3} : {}, pressed && {opacity:.7}]}><Image style={styles.actionButtonIcons} source={darkMode ? require("../images/heart.png") : require("../images/heartBlack.png")}/></Pressable>
        </View>
    </Pressable>
)}

const styles = StyleSheet.create({
    product:{
        width:'47%',
        elevation:4,
        margin:'auto',
        marginVertical:5,
        borderRadius:18,
        padding:12,
        alignItems:'center',
    },
    productImage:{
        width:120,
        height:120,
        borderRadius:10
    },
    productText:{
        fontFamily:"WorkSans-Medium",
        fontSize:15,
        marginVertical:10,
    },
    actionButtonsWrapper:{
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-around',
    },
    actionButtons:{
        width:60,
        height:45,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:6,
    },
    actionButtonIcons:{
        width:35,
        height:35,
    }
})