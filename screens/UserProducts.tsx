import { FlatList, Image, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {URL} from "@env"
import { getMonthString } from '../lib/lib'
import colors from '../lib/colors'

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
return (
    <View>
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
                            <Pressable style={({pressed}) => [styles.deleteBtn, pressed && darkMode ? {backgroundColor:colors.transparentWhite} : pressed && !darkMode && {backgroundColor:colors.black3}]}>
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
        right:5
    }
})