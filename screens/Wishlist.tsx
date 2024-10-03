import { StyleSheet, Text, View, FlatList, Pressable, Image, TextInput, useColorScheme, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import colors from '../lib/colors'

const dvw = Dimensions.get('screen').width
export default function Wishlist() {
    const darkMode = useColorScheme() === 'dark'
    const [wishlist, setWishlist] = useState<WishlistItem[]>([])
    useEffect(() => {
        async function getWishlist(){
            const session = await AsyncStorage.getItem("session")
            if(!session){
                return
            }
            const res = await fetch(`http://10.0.2.2:3000/api/wishlist`, {
                method:"GET",
                headers:{
                    "Mobile":"true",
                    "Authorization":`Bearer ${session}`
                }
            })
            const data = await res.json()
            console.log(data)
            setWishlist([...data.wishlistItems])
        }
        getWishlist()
    }, [])
    const productScale = useSharedValue(1)
    const productScaleAnim = useAnimatedStyle(() => {
        return {
            transform:[{scale:productScale.value}]
        }
    })
    const [deleteMode, setDeleteMode] = useState(false)
    function toggleDeleteMode(){
        setDeleteMode(prev => !prev)
    }
    async function addOrRemoveProduct(_id:string){

    }
 return (
    <View style={styles.wishlist}>
        <FlatList
            data={wishlist}
            renderItem={({item}) => (
                <Animated.View style={productScaleAnim}>
                    <Pressable onPress={() => addOrRemoveProduct(item._id)} onLongPress={toggleDeleteMode} style={[styles.product, darkMode ? {backgroundColor:colors.black, shadowColor:'white', elevation:6} : {backgroundColor:'white', shadowColor:'black', elevation:4}]}>
                        <Image style={styles.productImage} source={{uri:item.productImage}}/>
                        <View style={styles.productDataWrapper}>
                                <Text style={[styles.name, darkMode ? {color:'white'} : {color:'black'}]}>{item.productName}</Text>
                                <Text style={[styles.manufacturer, darkMode ? {color:'white'} : {color:'black'}]}>{item.manufacturer}</Text>
                                <Text style={[styles.price, darkMode ? {color:'white'} : {color:'black'}]}>{item.productPrice}€</Text>
                        </View>
                        {/* {deleteMode &&
                            <Animated.View entering={FadeInUp} exiting={FadeOutUp} style={[styles.checkmarkWrapper, darkMode ? {backgroundColor:colors.black} : {backgroundColor:'white'}]}>
                                {selectedProducts.includes(item._id) &&<Animated.Image entering={FadeIn.duration(100)} exiting={FadeOut.duration(100)}  style={styles.checkmark} source={darkMode? require('../images/checkmark.png') : require("../images/checkmarkBlack.png")}/>}
                            </Animated.View>
                        } */}
                    </Pressable>
                </Animated.View>
            )}
        />
    </View>
)}

const styles = StyleSheet.create({
    wishlist:{
        justifyContent:'center',
        alignItems:'center'
    },
    product:{
        width:dvw - 10,
        marginVertical:10,
        paddingVertical:10,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:12,
        position:'relative',
    },
    productImage:{
        width:'30%',
        height:'100%',
        borderRadius:12,
        margin:8
    },
    productDataWrapper:{
        width:'65%',
        justifyContent:'space-between',
    },
    name:{
        fontSize:17,
        fontFamily:"WorkSans-Medium",
        marginVertical:10,
        flexWrap:'wrap'
    },
    manufacturer:{
        fontSize:15,
        fontFamily:"WorkSans-Medium"
    },
    price:{
        fontSize:15,
        fontFamily:"WorkSans-Medium"
    },
})