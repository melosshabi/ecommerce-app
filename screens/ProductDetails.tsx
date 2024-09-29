import { Dimensions, Image, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DrawerScreenProps } from '@react-navigation/drawer'
import {URL} from "@env"
import colors from '../lib/colors'
import Footer from '../components/Footer'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { TextInput } from 'react-native-gesture-handler'

type ProductDetails = DrawerScreenProps<ComponentProps, 'ProductDetails'>
const dvh = Dimensions.get("screen").height
const dvw = Dimensions.get("screen").width
export default function ProductDetails({route}:ProductDetails) {
    const darkMode = useColorScheme() === 'dark'
    const [productData, setProductData] = useState<Product>()
    const [desiredQuantity, setDesiredQuantity] = useState(1)
    const picture1Opacity = useSharedValue(1)
    const [activeImageIndex, setActiveImageIndex] = useState(0)
    const picture1AnimStyle = useAnimatedStyle(() => {
      return {
        opacity:picture1Opacity.value
      }
    })
    const picture2Opacity = useSharedValue(0)
    const picture2AnimStyle = useAnimatedStyle(() => {
      return {
        opacity:picture2Opacity.value
      }
    })
    const picture3Opacity = useSharedValue(1)
    const picture3AnimStyle = useAnimatedStyle(() => {
      return {
        opacity:picture3Opacity.value
      }
    })
    const circle1Background = useSharedValue(colors.orange)
    const circle1AnimStyle = useAnimatedStyle(() => {
      return {
        backgroundColor:circle1Background.value
      }
    })
    const circle2Background = useSharedValue('gray')
    const circle2AnimStyle = useAnimatedStyle(() => {
      return {
        backgroundColor:circle2Background.value
      }
    })
    const circle3Background = useSharedValue('gray')
    const circle3AnimStyle = useAnimatedStyle(() => {
      return {
        backgroundColor:circle3Background.value
      }
    })
    function changeVisibleImage(newIndex:number){
      if(newIndex === 0){
        picture2Opacity.value = withTiming(0, {duration:150})
        picture3Opacity.value = withTiming(0, {duration:150})
        picture1Opacity.value = withTiming(1, {duration:150})
        circle1Background.value = withTiming(colors.orange, {duration:150})
        circle2Background.value = withTiming('gray', {duration:150})
        circle3Background.value = withTiming('gray', {duration:150})
        setActiveImageIndex(0)
      }else if(newIndex === 1){
        picture1Opacity.value = withTiming(0, {duration:150})
        picture2Opacity.value = withTiming(1, {duration:150})
        circle1Background.value = withTiming('gray', {duration:150})
        circle2Background.value = withTiming(colors.orange, {duration:150})
        circle3Background.value = withTiming('gray', {duration:150})
        setActiveImageIndex(newIndex)
      }else if(newIndex === 2){
        picture2Opacity.value = withTiming(0, {duration:150})
        picture3Opacity.value = withTiming(1, {duration:150})
        circle2Background.value = withTiming('gray', {duration:150})
        circle3Background.value = withTiming(colors.orange, {duration:150})
        setActiveImageIndex(newIndex)
      }else if(newIndex > 2){
        picture3Opacity.value = withTiming(0, {duration:150})
        picture1Opacity.value = withTiming(1, {duration:150})
        circle3Background.value = withTiming('gray', {duration:150})
        circle1Background.value = withTiming(colors.orange, {duration:150})
        setActiveImageIndex(0)
      }else if(newIndex < 0){
        picture1Opacity.value = withTiming(0, {duration:150})
        picture3Opacity.value = withTiming(1, {duration:150})
        circle1Background.value = withTiming('gray', {duration:150})
        circle3Background.value = withTiming(colors.orange, {duration:150})
        setActiveImageIndex(2)
      }
    }
    useEffect(() => {
        async function getProduct(){
            const res = await fetch(`${URL}/api/productDetails?_id=${route.params._id}`)
            const data:Product = await res.json()
            setProductData(data)
            
        }
        getProduct()
    }, [])
  return (
    <View style={styles.productPage}>
      <View>
        <View style={styles.slider}>
          <Pressable onPress={() => changeVisibleImage(activeImageIndex - 1)} style={({pressed}) => [styles.arrowButtons, pressed && darkMode ? {backgroundColor:colors.transparentWhite} : pressed && {backgroundColor:colors.black3}]}>
            <Image style={[styles.arrows, styles.leftArrow]} source={darkMode ? require('../images/arrow.png') : require("../images/arrowBlack.png")}/>
          </Pressable>
          <View style={styles.imagesWrapper}>
            <Animated.Image style={[styles.productImages,{zIndex:2}, picture1AnimStyle, darkMode ? {shadowColor:"white"} : {shadowColor:'black'}]} source={{uri:productData?.pictures[0]}}/>
            <Animated.Image style={[styles.productImages,{zIndex:1}, picture2AnimStyle, darkMode ? {shadowColor:"white"} : {shadowColor:'black'}]} source={{uri:productData?.pictures[1]}}/>
            <Animated.Image style={[styles.productImages,{zIndex:0}, picture3AnimStyle, darkMode ? {shadowColor:"white"} : {shadowColor:'black'}]} source={{uri:productData?.pictures[2]}}/>
          </View>
          <Pressable onPress={() => changeVisibleImage(activeImageIndex + 1)} style={({pressed}) => [styles.arrowButtons, pressed && darkMode ? {backgroundColor:colors.transparentWhite} : pressed && {backgroundColor:colors.black3}]}>
            <Image style={[styles.arrows, styles.rightArrow]} source={darkMode ? require('../images/arrow.png') : require("../images/arrowBlack.png")}/>
          </Pressable>
        </View>
        <View style={styles.circlesWrapper}>
          <Animated.View style={[styles.circles, circle1AnimStyle]}></Animated.View>
          <Animated.View style={[styles.circles, circle2AnimStyle]}></Animated.View>
          <Animated.View style={[styles.circles, circle3AnimStyle]}></Animated.View>
        </View>
      </View>
      <View>
        <Text style={[styles.productName, darkMode ? {color:'white'} : {color:'black'}]}>{productData?.productName}</Text>
        <Text style={[styles.manufacturer, darkMode ? {color:'white'} : {color:'black'}]}>{productData?.manufacturer}</Text>
        <Text style={[styles.price, darkMode ? {color:'white'} : {color:'black'}]}>{productData?.productPrice}€</Text>
        <Text style={[styles.stock, darkMode ? {color:'white'} : {color:'black'}]}>In Stock: {productData?.quantity}</Text>
        <TextInput keyboardType='number-pad' value={desiredQuantity.toString()}/>
      </View>
      <Footer currentScreen={undefined}/>
    </View>
  )
}

const styles = StyleSheet.create({
  productPage:{
    height:dvh - dvh / 7.5,
    justifyContent:'space-between'
  },
  slider:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    marginTop:10
  },
  arrowButtons:{
    height:50,
    width:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:50
  },
  arrows:{
    transform:[{scale:.3}]
  },
  leftArrow:{
    marginRight:5
  },
  rightArrow:{
    transform:[{rotate:'180deg'}, {scale:.3}],
    marginLeft:5
  },
  imagesWrapper:{
    height:dvh / 3,
    width: '75%',
    padding:5,
    // backgroundColor:'red',
    position:'relative'
  },
  productImages:{
    width:'100%',
    height:"100%",
    elevation:4,
    borderRadius:15,
    position:'absolute'
  },
  circlesWrapper:{
    flexDirection:'row',
    justifyContent:'center',
    marginTop:5
  },
  circles:{
    width:20,
    height:20,
    backgroundColor:'gray',
    borderRadius:50,
    marginHorizontal:2,
    borderWidth:2,
    borderColor:'black'
  },
  productName:{},
  manufacturer:{},
  price:{},
  stock:{},
})