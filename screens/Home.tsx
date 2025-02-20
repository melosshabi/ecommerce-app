import { Dimensions, StyleSheet, useColorScheme, View, FlatList, Image, Pressable, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import Animated, { Easing, FadeInRight, FadeOutRight, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
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
    const [showNotif, setShowNotif] = useState(false)
    const progressBarWidth = useSharedValue('85%')
    // @ts-ignore
    const progressBarStyle = useAnimatedStyle(() => {
        return {
            width:progressBarWidth.value
        }
    })
    const [alertOption, setAlertOption] = useState("")
    function showSucessAlert(option:"Cart" | "Wishlist"){
        setShowNotif(true)
        setAlertOption(option)
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
    <View style={[styles.homeScreen, darkMode && {backgroundColor:colors.black}]}>
        <FlatList
            data={products}
            numColumns={2}
            style={{marginTop:10}}
            renderItem={({item}) => (
                <Product _id={item._id} name={item.productName} picture={item.pictures[0]} price={item.productPrice} animationFunction={showSucessAlert}/>
            )}
        />
        {showNotif && 
            <Animated.View entering={FadeInRight} exiting={FadeOutRight} style={[styles.successAlert, darkMode ? {backgroundColor:colors.black} : {backgroundColor:'white'}]}>
                <View style={styles.checkMarkTextWrapper}>
                    <Image style={styles.greenCheckmark} source={darkMode ? require('../images/checkmark.png') : require("../images/checkmarkBlack.png")}/>
                    <Text style={[styles.addedText, darkMode ? {color:'white'} : {color:"black"}]}>Added To {alertOption}</Text>
                </View>
                <Animated.View style={[styles.progressBar, progressBarStyle]}></Animated.View>
            </Animated.View>
        }
        <Footer currentScreen='Home'/>
    </View>
)}

const styles = StyleSheet.create({
    homeScreen:{
        height:dvh,
        flex:1,
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