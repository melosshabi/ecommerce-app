import { Image, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native'
import React, { useState } from 'react'
import Footer from '../components/Footer'
import colors from '../lib/colors'
import { FlatList } from 'react-native-gesture-handler'
import Product from '../components/Product'
import Animated, { Easing, FadeInRight, FadeOutRight, useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated'
import { URL } from '@env'

export default function Search() {
    const darkMode = useColorScheme() === 'dark'
    const [query, setQuery] = useState("")
    const [products, setProducts] = useState<Product[]>([])
    const [resultsFor, setResultsFor] = useState("")

    async function searchProduct(){
        const res = await fetch(`${URL}/api/searchProducts?userQuery=${query}`)
        const data = await res.json()
        setProducts([...data.products])
        setResultsFor(query)
    }
    const [showNotif, setShowNotif] = useState(false)
    const progressBarWidth = useSharedValue('85%')
    // @ts-ignore
    const progressBarStyle = useAnimatedStyle(() => {
        return {
            width:progressBarWidth.value
        }
    })
    function showSucessAlert(){
        setShowNotif(true)
        if(progressBarWidth.value !== '0%' && progressBarWidth.value !== '85%'){
            progressBarWidth.value = '85%'
        }
        progressBarWidth.value = withTiming('0%', {duration:3000, easing:Easing.linear})
        setTimeout(() => {
            progressBarWidth.value = '100%'
            setShowNotif(false)
        }, 3100)
    }
return (
    <View style={[styles.searchPage, darkMode ? {backgroundColor:colors.black} : {backgroundColor:'white'}]}>
        <View style={[styles.searchWrapper, darkMode ? {backgroundColor:colors.black, shadowColor:'white', elevation:4} : {backgroundColor:'white', shadowColor:"black", elevation:4}]}>
            <TextInput style={[styles.searchInput, darkMode ? {color:"white"} : {color:"black"}]} placeholder='Search' defaultValue={query} onChangeText={text => setQuery(text)} onSubmitEditing={() => searchProduct()}/>
            <Image style={styles.magnifyingGlass} source={darkMode ? require('../images/magnifyingGlass.png') : require("../images/magnifyingGlassBlack.png")} />
        </View>
        {products.length > 0 && <Text style={[styles.title, darkMode ? {color:'white'} : {color:'black'}]}>Search Results For: {resultsFor}</Text>}
        <FlatList 
            data={products}
            style={{minWidth:'100%'}}
            numColumns={2}
            renderItem={({item}) => (
                <Product _id={item._id} name={item.productName} picture={item.pictures[0]} price={item.productPrice} animationFunction={showSucessAlert}/>
            )}/>
        {showNotif && 
            <Animated.View entering={FadeInRight} exiting={FadeOutRight} style={[styles.successAlert, darkMode ? {backgroundColor:colors.black} : {backgroundColor:'white'}]}>
                <View style={styles.checkMarkTextWrapper}>
                    <Image style={styles.greenCheckmark} source={darkMode ? require('../images/checkmark.png') : require("../images/checkmarkBlack.png")}/>
                    <Text style={[styles.addedText, darkMode ? {color:'white'} : {color:"black"}]}>Added To Cart</Text>
                </View>
                <Animated.View style={[styles.progressBar, progressBarStyle]}></Animated.View>
            </Animated.View>
        }
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
    },
    successAlert:{
        width:'50%',
        height:'10%',
        borderColor:colors.orange,
        borderWidth:1,
        borderRadius:20,
        position:'absolute',
        bottom:'10%',
        right:10,
        shadowColor:'black',
        elevation:4,
    },
    checkMarkTextWrapper:{
        width:'100%',
        height:'100%',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
    },
    greenCheckmark:{
        width:30,
        height:30,
        marginRight:10
    },
    addedText:{
        fontSize:17
    },
    progressBar:{
        height:5,
        backgroundColor:colors.orange,
        transform:[{translateY:-10}],
        marginLeft:20
    }
})