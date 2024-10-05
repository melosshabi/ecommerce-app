import {Dimensions, Image, Keyboard, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import colors from '../lib/colors'
import { FlatList } from 'react-native-gesture-handler'
import Product from '../components/Product'
import { useNavigation } from '@react-navigation/native'

export default function Search() {
    const navigation = useNavigation()
    const darkMode = useColorScheme() === 'dark'
    const [query, setQuery] = useState("")
    const [products, setProducts] = useState<Product[]>([])

    async function searchProduct(){
        const res = await fetch(`${process.env.URL}/api/searchProducts?userQuery=${query}`)
        const data = await res.json()
        setProducts([...data.products])
    }
    useEffect(() => {
        // I have to use type any in this case since the KeyboardEvent type doesn't include endCoordinates
        // Keyboard.addListener('keyboardDidShow', (e:any) => {
        //     pageTranslate.value = withTiming(-e.endCoordinates.height, {duration:150})
        // })
        // Keyboard.addListener("keyboardDidHide", () => {
        //     pageTranslate.value = withTiming(0, {duration:150})
        // })
    }, [])
return (
    <View style={[styles.searchPage, darkMode ? {backgroundColor:colors.black} : {backgroundColor:'white'}]}>
        <View style={[styles.searchWrapper, darkMode ? {backgroundColor:colors.black, shadowColor:'white', elevation:4} : {backgroundColor:'white', shadowColor:"black", elevation:4}]}>
            <TextInput style={[styles.searchInput, ]} placeholder='Search' defaultValue={query} onChangeText={text => setQuery(text)} onSubmitEditing={() => searchProduct()}/>
            <Image style={styles.magnifyingGlass} source={darkMode ? require('../images/magnifyingGlass.png') : require("../images/magnifyingGlassBlack.png")} />
        </View>
        {products.length > 0 && <Text style={[styles.title, darkMode ? {color:'white'} : {color:'black'}]}>Search Results For: {query}</Text>}
        <FlatList 
            data={products}
            style={{minWidth:'100%'}}
            numColumns={2}
            renderItem={({item}) => (
                <Product _id={item._id} name={item.productName} picture={item.pictures[0]} price={item.productPrice}/>
            )}/>
        <Footer currentScreen='Search' />
    </View>
)
}

const styles = StyleSheet.create({
    searchPage:{
        height:'100%',
        justifyContent:'space-between',
        alignItems:'center',
    },
    searchWrapper:{
        width:'70%',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginTop:20,
        borderRadius:8,
    },
    searchInput:{
        width:'80%',
        fontFamily:'WorkSans-Medium'
    },
    magnifyingGlass:{
        width:30,
        height:30,
        marginRight:5
    },
    title:{
        fontSize:20,
        fontFamily:"WorkSans-Medium",
        textAlign:'left',
        marginRight:'auto',
        marginLeft:15,
        marginTop:15
    }
})