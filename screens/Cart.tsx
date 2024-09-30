import { StyleSheet, Text, View, Dimensions, useColorScheme, Image, TextInput, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Footer from '../components/Footer'
import colors from '../lib/colors'
import { FlatList } from 'react-native-gesture-handler'

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
                        'mobile':'true',
                        'Authorization':session
                    }
                })
                const cartItems = await res.json()
                setCart([...cartItems.cartProducts])
            }
        }
        getUserObject()
    },[])
return (
    <View style={[styles.cartPage, darkMode ? {backgroundColor:colors.black} : {backgroundColor:'white'}]}>
            <FlatList style={{width:dvw, }} contentContainerStyle={{alignItems:'center'}}
                data={cart}
                renderItem={({item}) => (
                    <View style={[styles.product, darkMode ? {backgroundColor:colors.black, shadowColor:'white', elevation:6} : {backgroundColor:'white', shadowColor:'black', elevation:4}]}>
                        <Image style={styles.productImage} source={{uri:item.productImage}}/>
                        <View style={styles.productDataWrapper}>
                            <View>
                                <Text style={[styles.name, darkMode ? {color:'white'} : {color:'black'}]}>{item.productName}</Text>
                                <Text style={[styles.manufacturer, darkMode ? {color:'white'} : {color:'black'}]}>{item.manufacturer}</Text>
                            </View>
                            <View style={styles.priceStockWrapper}>
                                <Text style={[styles.price, darkMode ? {color:'white'} : {color:'black'}]}>{item.productPrice}€</Text>
                                <View style={styles.stockWrapper}>
                                    <Image style={styles.stockIcons} source={darkMode ? require('../images/minus.png') : require("../images/minusBlack.png")}/>
                                    <TextInput style={[styles.quantityInput, darkMode ? {backgroundColor:colors.black, shadowColor:'white', elevation:4, color:'white'} : {backgroundColor:'white', shadowColor:'white', elevation:4, color:'black'}]} value={item.desiredQuantity.toString()} editable={false}></TextInput>
                                    <Image style={styles.stockIcons} source={darkMode ? require('../images/plus.png') : require("../images/plusBlack.png")}/>
                                </View>
                            </View>
                        </View>
                        <Pressable style={styles.deleteButton}>
                            <Image style={styles.trashIcon} source={darkMode ? require('../images/trash.png') : require("../images/trashBlack.png")}/>
                        </Pressable>
                    </View>
                )}
            />
        <Footer currentScreen='Cart'/>
    </View>
)}

const styles = StyleSheet.create({
    cartPage:{
        height:'100%',
        width:'100%',
        justifyContent:'space-between',
        alignItems:'center'
    },
    product:{
        width:dvw - 20,
        marginVertical:10,
        flexDirection:'row',
        borderRadius:12,
        position:'relative'
    },
    productImage:{
        width:150,
        height:150,
        borderRadius:12,
        margin:8
    },
    productDataWrapper:{
        marginLeft:10,
        justifyContent:'space-between'
    },
    name:{
        fontSize:20,
        fontFamily:"WorkSans-Medium",
        marginVertical:10
    },
    manufacturer:{
        fontSize:15,
        fontFamily:"WorkSans-Medium"
    },
    price:{
        fontSize:20,
        fontFamily:"WorkSans-Medium"
    },
    priceStockWrapper:{
        width:'75%',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginBottom:5
    },
    stockWrapper:{
        flexDirection:'row',
        alignItems:'center'
    },
    stockIcons:{
        width:30,
        height:30
    },
    quantityInput:{
        width:50,
        height:40,
        textAlign:'center',
        borderRadius:8,
        fontFamily:"WorkSans-Medium",
        marginHorizontal:5
    },
    deleteButton:{
        position:'absolute',
        right:5,
        top:5,
    },
    trashIcon:{
        width:30,
        height:30,
    }
})