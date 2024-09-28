import { Dimensions, StyleSheet, Text, useColorScheme, View, FlatList, Image, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import {URL} from "@env"
import colors from '../lib/colors'
import Footer from '../components/Footer'
import Product from '../components/Product'

const dvh = Dimensions.get("screen").height
export default function Home() {
    const darkMode = useColorScheme() === 'dark'
    const [products, setProducts] = useState<Product[]>([])
    useEffect(() => {
        async function getProducts(){
            const res = await fetch(`${URL}/api/getProducts`)
            const data = await res.json()
            setProducts([...data.products])
        }
        getProducts()
    },[])
return (
    <View style={[styles.homeScreen, darkMode && {backgroundColor:colors.black}]}>
        <FlatList 
            data={products}
            numColumns={2}
            style={{marginTop:10}}
            renderItem={({item}) => (
                <Product _id={item._id} name={item.productName} picture={item.pictures[0]} price={item.productPrice}/>
            )}
        />
        <Footer currentScreen='Home'/>
    </View>
)}

const styles = StyleSheet.create({
    homeScreen:{
        height:dvh,
        flex:1
    }
})