import { StyleSheet, Text, View, Dimensions, useColorScheme, Image, TextInput, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Footer from '../components/Footer'
import colors from '../lib/colors'
import { FlatList } from 'react-native-gesture-handler'
import Animated, { Easing, FadeInRight, FadeOutRight, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

const dvw = Dimensions.get("screen").width
export default function Cart() {
    const darkMode = useColorScheme() === 'dark'
    const [user, setUser] = useState<DecodedToken | null>(null)
    const [cart, setCart] = useState<CartItem[]>([])
    useEffect(() => {
        async function getUserObject(){
            const data = await AsyncStorage.getItem("user")
            const session = await AsyncStorage.getItem("session")
            if(!session){
                return
            }
            if(data){
                setUser(JSON.parse(data))
                const res = await fetch(`${process.env.URL}/api/editCart`, {
                    method:"GET",
                    headers:{
                        'Authorization':`Bearer ${session}`,
                        'Mobile':'true'
                    }
                })
                const cartItems = await res.json()
                setCart([...cartItems.cartProducts])
            }
        }
        getUserObject()
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
            await fetch(`${process.env.URL}/api/editCart`, {
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
        }, 1000)
        setQuantityTimeout(timeout)
    }
return (
    <>
        <View style={[styles.cartPage, darkMode ? {backgroundColor:colors.black} : {backgroundColor:'white'}]}>
                <FlatList style={{width:dvw, height:'100%'}} contentContainerStyle={{alignItems:'center'}}
                    data={cart}
                    renderItem={({item}) => (
                        <View style={[styles.product, darkMode ? {backgroundColor:colors.black, shadowColor:'white', elevation:6} : {backgroundColor:'white', shadowColor:'black', elevation:4}]}>
                            <Image style={styles.productImage} source={{uri:item.productImage}}/>
                            <View style={styles.productDataWrapper}>
                                    <Text style={[styles.name, darkMode ? {color:'white'} : {color:'black'}]}>{item.productName}</Text>
                                    <Text style={[styles.manufacturer, darkMode ? {color:'white'} : {color:'black'}]}>{item.manufacturer}</Text>
                                <View style={styles.priceStockWrapper}>
                                    <Text style={[styles.price, darkMode ? {color:'white'} : {color:'black'}]}>{item.productPrice}€</Text>
                                    <View style={styles.stockWrapper}>
                                        <Pressable onPress={() => updateQuantity(item._id, QuantityActions.dec, item.desiredQuantity, item.availableQuantity)} style={({pressed}) => [styles.quantityButtons, darkMode && pressed ? {backgroundColor:colors.transparentWhite} : pressed && {backgroundColor:colors.black3}]}>
                                            <Image style={styles.stockIcons} source={darkMode ? require('../images/minus.png') : require("../images/minusBlack.png")}/>
                                        </Pressable>
                                        <TextInput style={[styles.quantityInput, darkMode ? {backgroundColor:colors.black, shadowColor:'white', elevation:4, color:'white'} : {backgroundColor:'white', shadowColor:'white', elevation:4, color:'black'}]} value={item.desiredQuantity.toString()} editable={false}></TextInput>
                                        <Pressable onPress={() => updateQuantity(item._id, QuantityActions.inc, item.desiredQuantity, item.availableQuantity)} style={({pressed}) => [styles.quantityButtons, darkMode && pressed ? {backgroundColor:colors.transparentWhite} : pressed && {backgroundColor:colors.black3}]}>
                                            <Image style={styles.stockIcons} source={darkMode ? require('../images/plus.png') : require("../images/plusBlack.png")}/>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                            {/* <Pressable style={styles.deleteButton}>
                                <Image style={styles.trashIcon} source={darkMode ? require('../images/trash.png') : require("../images/trashBlack.png")}/>
                            </Pressable> */}
                        </View>
                    )}
                />

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
    deleteButton:{
        position:'absolute',
        right:5,
        top:5,
    },
    trashIcon:{
        width:30,
        height:30,
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
    }
})