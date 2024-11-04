import { FlatList, Image, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {URL} from "@env"
import { getMonthString } from '../lib/lib'
import colors from '../lib/colors'
import Footer from '../components/Footer'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

export default function UserProducts() {
    const [products, setProducts] = useState<Product[]>([])
    const darkMode = useColorScheme() === 'dark'
    useEffect(() => {
        async function getUserProducts(){
            const session = await AsyncStorage.getItem("session")
            if(session){
                const res = await fetch(`${URL}/api/getUserProducts`, {
                    headers:{
                        'Mobile':'true',
                        'Authorization':`Bearer ${session}`
                    }
                })
                const data = await res.json()
                setProducts(data.products)
            }
        }
        getUserProducts()
    }, [])
    const deleteNotifTranslate = useSharedValue(500)
    const deleteNotif = useAnimatedStyle(() => {
        return {
            // width:'60%',
            backgroundColor:darkMode ? colors.black : "white",
            position:'absolute',
            padding:10,
            borderRadius:8,
            elevation:5,
            shadowColor: darkMode ? 'white' : 'black',
            bottom:70,
            transform:[{translateX:deleteNotifTranslate.value}]
        }
    })
    const progressBarWidth = useSharedValue('100%')
    // @ts-ignore
    const progressBar = useAnimatedStyle(() => {
        return {
            backgroundColor:colors.orange,
            width:progressBarWidth.value,
            height:3,
            borderRadius:8,
            marginTop:5
        }
    })
    async function deleteUserProduct(productDocId:string){
        const tempArr = [...products]
        const newProducts = tempArr.filter((product:Product) => product._id !== productDocId)
        setProducts([...newProducts])
        const token = await AsyncStorage.getItem('session')
        const res = await fetch(`http://10.0.2.2:3000/api/unlistProduct`, {
            method:"DELETE",
            headers:{
                'Mobile':'true',
                'Authorization':`Bearer ${token}`
            },
            body:JSON.stringify({
                productDocId
            })
            
        })
        const data = await res.json()
        if(data.msg === 'product-unlisted'){
            deleteNotifTranslate.value = withTiming(180, {duration:500, easing:Easing.elastic()})
            progressBarWidth.value = withTiming("0%", {duration:3000, easing:Easing.linear})
            setTimeout(() => {
                deleteNotifTranslate.value = withTiming(500, {duration:500, easing:Easing.elastic()})
            }, 3000)
            setTimeout(() => {
                progressBarWidth.value = '100%'
            }, 3500)
        }
    }
return (
    <View style={[{height:'100%', justifyContent:'space-between'}, darkMode ? {backgroundColor:colors.black} : {backgroundColor:'white'}]}>
        <Text style={[styles.title, darkMode ? {color:'white'} : {color:'black'}]}>My Products</Text>
        { products.length > 0 && products.length > 0 && 
        <FlatList
            data={products}
            numColumns={1}
            style={{marginTop:10}}
            renderItem={({item, index}) => {
                const orderDate = new Date(item.createdAt)
                const year = orderDate.getFullYear()
                const month = getMonthString(orderDate.getMonth())
                const date = orderDate.getDate()
            return (
                <View style={[styles.product, darkMode ? {backgroundColor:colors.black, shadowColor:'white', elevation:4} : {backgroundColor:'white', shadowColor:'black', elevation:4}]}>
                    <View><Image style={styles.images} source={{uri:products[index].pictures[0]}}/></View>
                    <View style={styles.productData}>
                        <View style={styles.productNameTrashWrapper}>
                            <Text style={[styles.text, darkMode ? {color:'white'} : {color:'black'}]}>{products[index].productName}</Text>
                            <Pressable onPress={() => deleteUserProduct(item._id)} style={({pressed}) => [styles.deleteBtn, pressed && darkMode ? {backgroundColor:colors.transparentWhite} : pressed && !darkMode && {backgroundColor:colors.black3}]}>
                                <Image style={styles.trash} source={darkMode ? require('../images/trash.png') : require("../images/trashBlack.png")}/>
                            </Pressable>
                        </View>
                        <Text style={[styles.text, darkMode ? {color:'white'} : {color:'black'}]}>{products[index].manufacturer}</Text>
                        <Text style={[styles.text, darkMode ? {color:'white'} : {color:'black'}]}>{products[index].productPrice}€</Text>
                        <Text style={[styles.text, styles.date, darkMode ? {color:'white'} : {color:'black'}]}>{`${date}-${month}-${year}`}</Text>
                    </View>
                </View>
            )}
        } 
        />}
        <Animated.View style={deleteNotif}>
            <View style={{flexDirection:'row', alignItems:'center', paddingVertical:10}}>
                <Text style={[styles.deleteText, darkMode ? {color:'white'} : {color:'black'}]}>Product Deleted</Text>
                <Image style={styles.checkmark} source={darkMode ? require("../images/checkmark.png") : require('../images/checkmarkBlack.png')}/>
            </View>
            <Animated.View style={progressBar}></Animated.View>
        </Animated.View>
        <Footer currentScreen={undefined}/>
    </View>
)}

const styles = StyleSheet.create({
    title:{
        textAlign:'center',
        fontFamily:"WorkSans-Medium",
        fontSize:22,
        marginTop:5
    },
    product:{
        width:'95%',
        flexDirection:'row',
        marginLeft:'2.5%',
        marginVertical:10,
        borderRadius:12,
        paddingHorizontal:10,
        paddingVertical:20,
        position:'relative'
    },
    images:{
        width:100,
        height:100,
        borderRadius:12
    },
    productData:{
        width:'72%',
        marginLeft:'2%'
    },
    text:{
        width:'85%',
        fontFamily:"WorkSans-Medium",
        marginVertical:2,
    },
    productNameTrashWrapper:{
        flexDirection:'row',
    },
    deleteBtn:{
        padding:2,
        borderRadius:8,
    },
    trash:{
        width:30,
        height:30,
    },
    date:{
        position:"absolute",
        bottom:-15,
    },
    deleteText:{
        marginHorizontal:10,
        fontFamily:"WorkSans-Medium",
        fontSize:15,
    },
    checkmark:{
        width:30,
        height:30
    }
})