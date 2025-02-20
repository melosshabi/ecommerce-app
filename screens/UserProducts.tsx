import { FlatList, Image, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {URL} from "@env"
import { getMonthString } from '../lib/lib'
import colors from '../lib/colors'
import Footer from '../components/Footer'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { TextInput } from 'react-native-gesture-handler'

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
    const [notifText, setNotifText] = useState("")
    const deleteNotifTranslate = useSharedValue(500)
    const deleteNotif = useAnimatedStyle(() => {
        return {
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
    function startNotifAnim(){
            deleteNotifTranslate.value = withTiming(180, {duration:500, easing:Easing.elastic()})
            progressBarWidth.value = withTiming("0%", {duration:3000, easing:Easing.linear})
            setTimeout(() => {
                deleteNotifTranslate.value = withTiming(500, {duration:500, easing:Easing.elastic()})
            }, 3000)
            setTimeout(() => {
                progressBarWidth.value = '100%'
            }, 3500)
    }
    async function deleteUserProduct(productDocId:string){
        const tempArr = [...products]
        const newProducts = tempArr.filter((product:Product) => product._id !== productDocId)
        setProducts([...newProducts])
        const token = await AsyncStorage.getItem('session')
        const res = await fetch(`${URL}/api/unlistProduct`, {
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
            setNotifText("Product Deleted")
            startNotifAnim()
        }
    }

    const [quantityTimeout, setQuantityTimeout] = useState<NodeJS.Timeout | null>(null)
    async function updateQuantity(productId:string, newQuantity:number){
        const tempProducts = [...products]
        tempProducts.forEach((product:Product) => {
            if(product._id === productId){
                product.quantity = newQuantity
            }
        })
        setProducts([...tempProducts])
        if(quantityTimeout){
            clearTimeout(quantityTimeout)
            setQuantityTimeout(null)
        }
        setTimeout(async () => {
            const token = await AsyncStorage.getItem("session")
            const res = await fetch(`${URL}/api/updateProductQuantity`, {
                method:"PATCH",
                headers:{
                    "Mobile":'true',
                    "Authorization":`Authorization ${token}`
                },
                body:JSON.stringify({
                    productDocId:productId,
                    newQuantity
                })
            })
            const data = await res.json()
            if(data.msg === 'product-updated'){
                setNotifText("Quantity Updated")
                startNotifAnim()
            }
        }, 1000)
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
                        <View style={styles.dateQuantityWrapper}>
                            <Text style={[styles.date, darkMode ? {color:'white'} : {color:'black'}]}>{`${date}-${month}-${year}`}</Text>
                            <View>
                                <Text style={[styles.quantityText, darkMode ? {color:'white'} : {color:'black'}]}>Quantity</Text>
                                <View style={styles.quantity}>
                                    <Pressable style={styles.quantityButtons} onPress={() => updateQuantity(item._id, item.quantity - 1)}>
                                        <Image source={darkMode ? require("../images/minus.png") : require('../images/minusBlack.png')} style={styles.quantityIcons}/>
                                    </Pressable>
                                    <TextInput editable={false}  value={item.quantity.toString()} style={[styles.quantityInput, darkMode ? {shadowColor:"white", backgroundColor:colors.black , elevation:4, color:'white'} : {shadowColor:"black", backgroundColor:'white', elevation:4, color:'black'}]} keyboardType='number-pad'/>
                                    <Pressable style={styles.quantityButtons} onPress={() => updateQuantity(item._id, item.quantity + 1)}>
                                        <Image source={darkMode ? require('../images/plus.png') : require("../images/plusBlack.png")} style={styles.quantityIcons}/>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            )}
        }
        />}
        <Animated.View style={deleteNotif}>
            <View style={{flexDirection:'row', alignItems:'center', paddingVertical:10}}>
                <Text style={[styles.deleteText, darkMode ? {color:'white'} : {color:'black'}]}>{notifText}</Text>
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
    deleteText:{
        marginHorizontal:10,
        fontFamily:"WorkSans-Medium",
        fontSize:15,
    },
    checkmark:{
        width:30,
        height:30
    },
    dateQuantityWrapper:{
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'flex-end',
    },
    date:{
        fontFamily:"WorkSans-Medium"
    },
    quantity:{
        flexDirection:'row',
        alignItems:'center'
    },
    quantityText:{
        fontFamily:"WorkSans-Medium",
        textAlign:'center',
        marginBottom:10
    },
    quantityButtons:{
        marginHorizontal:5
    },
    quantityIcons:{
        width:30,
        height:30,
    },
    quantityInput:{
        width:50,
        height:35,
        borderRadius:8,
        textAlign:'center',
    },
})