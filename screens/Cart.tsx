import { StyleSheet, Text, View, Dimensions, useColorScheme, Image, TextInput, Pressable, Keyboard, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Footer from '../components/Footer'
import colors from '../lib/colors'
import { FlatList } from 'react-native-gesture-handler'
import Animated, { Easing, FadeIn, FadeInRight, FadeInUp, FadeOut, FadeOutRight, FadeOutUp, FlipOutXUp, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import { URL } from '@env'

const dvw = Dimensions.get("screen").width
export default function Cart() {
    const darkMode = useColorScheme() === 'dark'
    const [cart, setCart] = useState<CartItem[]>([])
    useEffect(() => {
        async function getCartList(){
            const session = await AsyncStorage.getItem("session")
            if(!session){
                return
            }
            const res = await fetch(`${URL}/api/editCart`, {
                method:"GET",
                headers:{
                    'Authorization':`Bearer ${session}`,
                    'Mobile':'true'
                }
            })
            const cartItems = await res.json()
            setCart([...cartItems.cartProducts])
        }
        getCartList()
    },[])
    const [showQuantityError, setShowQuantityError] = useState(false)
    const errorProgressBarWidth = useSharedValue('100%')
    // @ts-ignore
    const errorProgressBarAnim = useAnimatedStyle(() => {
        return {
            width:errorProgressBarWidth.value
        }
    })
    enum QuantityActions {
        dec,
        inc
    }
    const [quantityTimeout, setQuantityTimeout] = useState<NodeJS.Timeout | null>(null)
    const [errorTimeout, setErrorTimeout] = useState<NodeJS.Timeout | null>(null)
    async function updateQuantity(productId:string, action:QuantityActions, currentDesiredQuantity:number, availableQuantity:number){
        if(quantityTimeout){
            clearTimeout(quantityTimeout)
            setQuantityTimeout(null)
        }
        if(action === QuantityActions.inc && currentDesiredQuantity + 1 > availableQuantity){
            if(errorTimeout){
                errorProgressBarWidth.value = '100%'
                clearTimeout(errorTimeout)
                setErrorTimeout(null)
            }
            setShowQuantityError(true)
            errorProgressBarWidth.value = withTiming('0%', {duration:3000, easing:Easing.linear})
            const errTimeout = setTimeout(() => {
                setShowQuantityError(false)
                errorProgressBarWidth.value = '100%'
            }, 3000)
            setErrorTimeout(errTimeout)
            const session = await AsyncStorage.getItem("session")
            await fetch(`${URL}/api/editCart`, {
                method:"PATCH",
                headers:{
                    "Authorization": `Bearer ${session}`,
                    "Mobile":"true"
                },
                body:JSON.stringify({
                    productDocId:productId,
                    quantity:availableQuantity
                })
            })
            return
        }
        if(action === QuantityActions.dec && currentDesiredQuantity - 1 === 0) return

        const products = [...cart]
            products.forEach(product => {
                if(product._id === productId){
                    action === QuantityActions.inc ? 
                    product.desiredQuantity += 1 :
                    product.desiredQuantity -= 1
                }
            })
            setCart([...products])

        const timeout = setTimeout(async () => {
            const session = await AsyncStorage.getItem("session")
            await fetch(`${URL}/api/editCart`, {
                method:"PATCH",
                headers:{
                    "Authorization": `Bearer ${session}`,
                    "Mobile":"true"
                },
                body:JSON.stringify({
                    productDocId:productId,
                    quantity:action === QuantityActions.inc ? currentDesiredQuantity += 1 : currentDesiredQuantity -= 1
                })
            })
        }, 500)
        setQuantityTimeout(timeout)
    }

    const [deleteMode, setDeleteMode] = useState(false)
    const [selectedProducts, setSelectedProducts] = useState<string[]>([])
    const APressable = Animated.createAnimatedComponent(Pressable)
    const productScale = useSharedValue(1)
    const productScaleAnim = useAnimatedStyle(() => {
        return {
            transform:[{scale:productScale.value}]
        }
    })
    function toggleDeleteMode(){
        setDeleteMode(prev => !prev)
        productScale.value = withTiming(!deleteMode ? .9 : 1, {duration:150})
    }
    function addOrRemoveProduct(_id:string){
        if(deleteMode && selectedProducts.includes(_id)){
            setSelectedProducts(prev => prev.filter(id => id !== _id))
            return
        }
        setSelectedProducts(prev => [...prev, _id])
    }
    async function deleteCartItems(){
        setDeleteMode(false)
        productScale.value = withTiming(1, {duration:150})
        const filteredProducts = cart.filter(product => !selectedProducts.includes(product._id))
        setCart([...filteredProducts])
        const session = await AsyncStorage.getItem("session")
        await fetch(`${URL}/api/editCart`, {
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
    }
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => {
            if(deleteMode){
                productScale.value = withTiming(1, {duration:150})
                setDeleteMode(false)
            }
            return true
        })
    },[])
return (
    <>
        <View style={[styles.cartPage, darkMode ? {backgroundColor:colors.black} : {backgroundColor:'white'}]}>
            {cart.length === 0 ? <Text style={[styles.title, darkMode ? {color:'white'} : {color:'black'}]}>Your cart is empty</Text> :
                <FlatList style={{width:dvw, height:'100%'}} contentContainerStyle={{alignItems:'center'}}
                data={cart}
                renderItem={({item}) => (
                    <Animated.View style={productScaleAnim}>
                        <Pressable onPress={() => addOrRemoveProduct(item._id)} onLongPress={toggleDeleteMode} style={[styles.product, darkMode ? {backgroundColor:colors.black, shadowColor:'white', elevation:6} : {backgroundColor:'white', shadowColor:'black', elevation:4}]}>
                            <Image style={styles.productImage} source={{uri:item.productImage}}/>
                            <View style={styles.productDataWrapper}>
                                    <Text style={[styles.name, darkMode ? {color:'white'} : {color:'black'}]}>{item.productName}</Text>
                                    <Text style={[styles.manufacturer, darkMode ? {color:'white'} : {color:'black'}]}>{item.manufacturer}</Text>
                                <View style={styles.priceStockWrapper}>
                                    <Text style={[styles.price, darkMode ? {color:'white'} : {color:'black'}]}>{item.productPrice}€</Text>
                                    <View style={styles.stockWrapper}>
                                        <Pressable disabled={deleteMode} onPress={() => updateQuantity(item._id, QuantityActions.dec, item.desiredQuantity, item.availableQuantity)} style={({pressed}) => [styles.quantityButtons, darkMode && pressed ? {backgroundColor:colors.transparentWhite} : pressed && {backgroundColor:colors.black3}]}>
                                            <Image style={styles.stockIcons} source={darkMode ? require('../images/minus.png') : require("../images/minusBlack.png")}/>
                                        </Pressable>
                                        <TextInput style={[styles.quantityInput, darkMode ? {backgroundColor:colors.black, shadowColor:'white', elevation:4, color:'white'} : {backgroundColor:'white', shadowColor:'black', elevation:4, color:'black'}]} value={item.desiredQuantity.toString()} editable={false}></TextInput>
                                        <Pressable disabled={deleteMode} onPress={() => updateQuantity(item._id, QuantityActions.inc, item.desiredQuantity, item.availableQuantity)} style={({pressed}) => [styles.quantityButtons, darkMode && pressed ? {backgroundColor:colors.transparentWhite} : pressed && {backgroundColor:colors.black3}]}>
                                            <Image style={styles.stockIcons} source={darkMode ? require('../images/plus.png') : require("../images/plusBlack.png")}/>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                            {deleteMode &&
                                <Animated.View entering={FadeInUp} exiting={FadeOutUp} style={[styles.checkmarkWrapper, darkMode ? {backgroundColor:colors.black} : {backgroundColor:'white'}]}>
                                    {selectedProducts.includes(item._id) &&<Animated.Image entering={FadeIn.duration(100)} exiting={FadeOut.duration(100)}  style={styles.checkmark} source={darkMode? require('../images/checkmark.png') : require("../images/checkmarkBlack.png")}/>}
                                </Animated.View>
                            }
                        </Pressable>
                    </Animated.View>
                )}
                />
            }
                
            {selectedProducts.length > 0 && deleteMode &&
                <APressable onPress={() => deleteCartItems()} entering={FadeInRight.duration(150)} exiting={FadeOutRight.duration(150)}  style={[styles.deleteButton, darkMode ? {borderColor:'white'} : {borderColor:'black'}]}>
                    <Image style={styles.trashIcon} source={require("../images/trash.png")}/>
                </APressable>
            }
            <Footer currentScreen='Cart'/>
        </View>
        {showQuantityError && <Animated.View entering={FadeInRight} exiting={FadeOutRight} style={[styles.maxQuantityAlert, darkMode ? {backgroundColor:colors.black, borderColor:'white'} : {backgroundColor:'white', borderColor:'black'}]}>
            <Image style={styles.redCross} source={require('../images/redCross.png')}/>
            <Text style={[styles.maxQuantityText, darkMode ? {color:'white'} : {color:'black'}]}>Max quantity reached</Text>
            <Animated.View style={[styles.maxQuantityTimeBar, errorProgressBarAnim]}></Animated.View>
        </Animated.View>}
    </>
)}

const styles = StyleSheet.create({
    title:{
        fontSize:25,
        fontFamily:"WorkSans-Medium",
        marginTop:'10%'
    },
    cartPage:{
        height:'100%',
        width:'100%',
        justifyContent:'space-between',
        alignItems:'center',
    },
    product:{
        width:dvw - 10,
        marginVertical:10,
        flexDirection:'row',
        borderRadius:12,
        position:'relative',
    },
    productImage:{
        width:'30%',
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
    priceStockWrapper:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginBottom:5,
    },
    stockWrapper:{
        flexDirection:'row',
        alignItems:'center'
    },
    stockIcons:{
        width:30,
        height:30,
    },
    quantityInput:{
        width:40,
        height:40,
        textAlign:'center',
        borderRadius:8,
        fontFamily:"WorkSans-Medium",
        marginHorizontal:5,
    },
    quantityButtons:{
        borderRadius:8,
        marginHorizontal:5,
        padding:5,
    },
    maxQuantityAlert:{
        width:'60%',
        borderWidth:1,
        paddingHorizontal:8,
        paddingVertical:12,
        borderRadius:12,
        flexDirection:'row',
        alignItems:'center',
        shadowColor:colors.orange,
        elevation:4,
        position:'absolute',
        bottom:'10%',
        right:10
    },
    redCross:{
        width:40,
        height:40
    },
    maxQuantityText:{
        fontFamily:"WorkSans-Medium",
        fontSize:15,
        textAlign:'center',
        marginLeft:10,
    },
    maxQuantityTimeBar:{
        width:'100%',
        height:3,
        backgroundColor:colors.orange,
        marginTop:10,
        position:'absolute',
        bottom:5,
        left:8
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