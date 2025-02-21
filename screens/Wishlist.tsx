import { StyleSheet, Text, View, FlatList, Pressable, Image, useColorScheme, Dimensions, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Animated, { FadeIn, FadeInRight, FadeInUp, FadeOut, FadeOutRight, FadeOutUp, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import colors from '../lib/colors'
import Footer from '../components/Footer'
import {URL} from "@env"
import { useIsFocused, useNavigation } from '@react-navigation/native'
import Loader from '../components/Loader'

const dvw = Dimensions.get('screen').width
export default function Wishlist() {
    const darkMode = useColorScheme() === 'dark'
    const [wishlist, setWishlist] = useState<WishlistItem[]>([])
    const [auth, setAuth] = useState(false)
    const [reqPending, setReqPending] = useState(true)
    const isFocused = useIsFocused()
    useEffect(() => {
        if(!isFocused){
            setReqPending(true)
            setWishlist([])
            setAuth(false)
            if(deleteMode){
                toggleDeleteMode()
            }
        }else{
            async function getWishlist(){
                const session = await AsyncStorage.getItem("session")
                if(session){
                    setAuth(true)
                    const res = await fetch(`${URL}/api/wishlist`, {
                        method:"GET",
                        headers:{
                            "Mobile":"true",
                            "Authorization":`Bearer ${session}`
                        }
                    })
                    const data = await res.json()
                    setWishlist([...data.wishlistItems])
                }else{
                    const stringifiedWishlist = await AsyncStorage.getItem("wishlist")
                    if(stringifiedWishlist){
                        const localWishlist = JSON.parse(stringifiedWishlist)
                        const productPromises: Promise<Response>[] = []
                        localWishlist.forEach(async (product:any) => {
                            const promise = fetch(`${URL}/api/productDetails?_id=${product.productDocId}`)
                            productPromises.push(promise)
                        })
                        await Promise.all(productPromises).then(responses => {
                            return Promise.all(responses.map(response => response.json()))
                        }).then(data => setWishlist([...data]))
                    }
                }
            }
            getWishlist().then(() => setReqPending(false))
            
        }
    }, [isFocused])
    const APressable = Animated.createAnimatedComponent(Pressable)
    const productScale = useSharedValue(1)
    const productScaleAnim = useAnimatedStyle(() => {
        return {
            transform:[{scale:productScale.value}]
        }
    })
    const [deleteMode, setDeleteMode] = useState(false)
    const [selectedProducts, setSelectedProducts] = useState<string[]>([])
    useEffect(() => {
        console.log(selectedProducts)
    }, [selectedProducts])
    function toggleDeleteMode(){
        setDeleteMode(prev => !prev)
        productScale.value = withTiming(!deleteMode ? .9 : 1, {duration:150})
    }
    async function addOrRemoveProduct(_id:string){
        if(deleteMode && selectedProducts.includes(_id)){
            setSelectedProducts(prev => prev.filter(id => id !== _id))
            return
        }
        setSelectedProducts(prev => [...prev, _id])
    }
    async function deleteWishlistItems(){
        setDeleteMode(false)
        productScale.value = withTiming(1, {duration:150})
        const filteredProducts = wishlist.filter(product => !selectedProducts.includes(product.productDocId || product._id))
        setWishlist([...filteredProducts])
        const session = await AsyncStorage.getItem("session")
        if(session){
            await fetch(`${URL}/api/wishlist`, {
                method:"DELETE",
                headers:{
                    'Mobile':'True',
                    "Authorization":`Bearer ${session}`
                },
                body:JSON.stringify({
                    itemsToRemove:[...selectedProducts]
                })
            })
            setSelectedProducts([])
        }else{
            const newWishlist:LocalWishlistItem[] = []
            filteredProducts.forEach(product => {
                newWishlist.push({productDocId:product.productDocId})
            })
            await AsyncStorage.setItem("wishlist", JSON.stringify(newWishlist))
        }
    }
    const navigation = useNavigation()
    BackHandler.addEventListener("hardwareBackPress", () => {
        if(deleteMode){
            setDeleteMode(false)
            productScale.value = withTiming(1, {duration:150})
            setSelectedProducts([])
            return true
        }
        navigation.goBack()
    })
return (
    <>
    {reqPending && <Loader/>}
    <View style={[styles.wishlist, darkMode ? {backgroundColor:colors.black} : {backgroundColor:'white'}]}>
        
        {wishlist.length === 0 ? <Text style={[styles.title, darkMode ? {color:'white'} : {color:'black'}]}>Your wishlist is empty</Text> :
        <FlatList
            style={{width:dvw}}
            contentContainerStyle={{alignItems:'center'}}
            data={wishlist}
            renderItem={({item}) => {
                console.log(item)
                return (
                <Animated.View style={productScaleAnim} key={item.productDocId || item._id}>
                    <Pressable onPress={() => addOrRemoveProduct(item.productDocId || item._id)} onLongPress={toggleDeleteMode} style={[styles.product, darkMode ? {backgroundColor:colors.black, shadowColor:'white', elevation:6} : {backgroundColor:'white', shadowColor:'black', elevation:4}]}>
                        <Image style={styles.productImage} source={{uri:auth ? item.productImage : item.pictures[0]}}/>
                        <View style={styles.productDataWrapper}>
                            <Text style={[styles.name, darkMode ? {color:'white'} : {color:'black'}]}>{item.productName}</Text>
                            <Text style={[styles.manufacturer, darkMode ? {color:'white'} : {color:'black'}]}>{item.manufacturer}</Text>
                            <Text style={[styles.price, darkMode ? {color:'white'} : {color:'black'}]}>{item.productPrice}€</Text>
                        </View>
                        {deleteMode &&
                            <Animated.View entering={FadeInUp} exiting={FadeOutUp} style={[styles.checkmarkWrapper, darkMode ? {backgroundColor:colors.black} : {backgroundColor:'white'}]}>
                                {selectedProducts.includes(item.productDocId || item._id) && <Animated.Image entering={FadeIn.duration(100)} exiting={FadeOut.duration(100)}  style={styles.checkmark} source={darkMode? require('../images/checkmark.png') : require("../images/checkmarkBlack.png")}/>}
                            </Animated.View>
                        }
                    </Pressable>
                </Animated.View>
            )}}
        />}
        {selectedProducts.length > 0 && deleteMode &&
                <APressable onPress={() => deleteWishlistItems()} entering={FadeInRight.duration(150)} exiting={FadeOutRight.duration(150)}  style={[styles.deleteButton, darkMode ? {borderColor:'white'} : {borderColor:'black'}]}>
                    <Image style={styles.trashIcon} source={require("../images/trash.png")}/>
                </APressable>
        }
        <Footer currentScreen="Wishlist"/>
    </View>
    </>
)}

const styles = StyleSheet.create({
    title:{
        fontSize:25,
        fontFamily:"WorkSans-Medium",
        marginTop:'10%'
    },
    wishlist:{
        height:'100%',
        justifyContent:'space-between',
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
    checkmarkWrapper:{
        width:40,
        height:40,
        position:'absolute',
        right:5,
        top:5,
        borderRadius:50,
        borderColor:colors.orange,
        borderWidth:1,
        justifyContent:'center',
        alignItems:'center'
    },
    checkmark:{
        width:30,
        height:30
    },
    deleteButton:{
        position:'absolute',
        right:10,
        bottom:70,
        borderWidth:1,
        borderRadius:50,
        padding:5,
        backgroundColor:colors.orange
    },
    trashIcon:{
        width:40,
        height:40,
    },
})