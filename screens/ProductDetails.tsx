import { Dimensions, Image, Keyboard, NativeSyntheticEvent, Pressable, StyleSheet, Text, TextInput, TextInputChangeEventData, useColorScheme, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DrawerScreenProps } from '@react-navigation/drawer'
import {URL} from "@env"
import colors from '../lib/colors'
import Footer from '../components/Footer'
import Animated, { useAnimatedStyle, useSharedValue, withTiming, } from 'react-native-reanimated'

type ProductDetails = DrawerScreenProps<ComponentProps, 'ProductDetails'>
const dvh = Dimensions.get("screen").height
const dvw = Dimensions.get("screen").width
export default function ProductDetails({route}:ProductDetails) {
    const darkMode = useColorScheme() === 'dark'
    const [productData, setProductData] = useState<Product>()
    const [imagesCount, setImagesCount] = useState(0)
    const pageTranslate = useSharedValue(0)
    const pageTranslateStyle = useAnimatedStyle(() => ({
      transform:[{translateY:pageTranslate.value}]
    }))
    useEffect(() => {
      async function getProduct(){
          const res = await fetch(`${URL}/api/productDetails?_id=${route.params._id}`)
          const data:Product = await res.json()
          setProductData(data)
          setImagesCount(data.pictures.length)
      }
      getProduct()
      // I have to use type any in this case since the KeyboardEvent type doesn't include endCoordinates
      Keyboard.addListener('keyboardDidShow', (e:any) => {
        pageTranslate.value = withTiming(-e.endCoordinates.height, {duration:150})
      })
      Keyboard.addListener("keyboardDidHide", () => {
        pageTranslate.value = withTiming(0, {duration:150})
      })
    }, [])

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
      if(newIndex > imagesCount - 1){
        newIndex = 0
        setActiveImageIndex(0)
      }
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
        picture3Opacity.value = withTiming(0, {duration:150})
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
        picture2Opacity.value = withTiming(0, {duration:150})
        picture1Opacity.value = withTiming(1, {duration:150})
        circle3Background.value = withTiming('gray', {duration:150})
        circle1Background.value = withTiming(colors.orange, {duration:150})
        setActiveImageIndex(0)
      }else if(newIndex < 0){
        picture1Opacity.value = withTiming(0, {duration:150})
        if(imagesCount === 3){
          picture3Opacity.value = withTiming(1, {duration:150})
          circle1Background.value = withTiming('gray', {duration:150})
          circle3Background.value = withTiming(colors.orange, {duration:150})
          setActiveImageIndex(2)
        } 
        else{
          picture2Opacity.value = withTiming(1, {duration:150})
          circle1Background.value = withTiming('gray', {duration:150})
          circle2Background.value = withTiming(colors.orange, {duration:150})
          setActiveImageIndex(1)
        } 
        
      }
    }
    const AInput = Animated.createAnimatedComponent(TextInput)
    const inputBorderColor = useSharedValue(darkMode ? 'white' : 'black')
    const inputBorderAnim = useAnimatedStyle(() => ({
        borderColor:inputBorderColor.value
    }))
    function handleQuantityInputFocus(focus:boolean){
      if(focus){
        inputBorderColor.value = withTiming(colors.orange, {duration:150})
      }else{
        inputBorderColor.value = withTiming(darkMode ? 'white' : 'black', {duration:150})
      }
    }
  return (
    
    <Animated.View style={[styles.productPage, pageTranslateStyle, darkMode && {backgroundColor:colors.black}]}>
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
          {productData?.pictures[1] && <Animated.View style={[styles.circles, circle2AnimStyle]}></Animated.View>}
          {productData?.pictures[2] && <Animated.View style={[styles.circles, circle3AnimStyle]}></Animated.View>}
        </View>
      </View>
      <View style={styles.productDetails}>
        <Text style={[styles.productName, darkMode ? {color:'white'} : {color:'black'}]}>{productData?.productName}</Text>
        <Text style={[styles.manufacturer, darkMode ? {color:'white'} : {color:'black'}]}>{productData?.manufacturer}</Text>
        <Text style={[styles.price, darkMode ? {color:'white'} : {color:'black'}]}>{productData?.productPrice}€</Text>
        <Text style={[styles.stock, darkMode ? {color:'white'} : {color:'black'}]}>In Stock: {productData?.quantity}</Text>
        <AInput onBlur={() => handleQuantityInputFocus(false)} onFocus={() => handleQuantityInputFocus(true)} style={[styles.quantityInput, inputBorderAnim]} keyboardType='number-pad' value={desiredQuantity.toString()}/>
      </View>
      <Footer currentScreen={undefined}/>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  productPage:{
    height:dvh - dvh / 7.5,
    justifyContent:'space-between',
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
    position:'relative'
  },
  productImages:{
    width:'100%',
    height:'100%',
    flex:1,
    elevation:4,
    borderRadius:15,
    position:'absolute',
    resizeMode:'contain'
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
  productDetails:{
    alignItems:'center'
  },
  productName:{
    fontSize:25,
    textAlign:'center',
    marginBottom:15
  },
  manufacturer:{
    fontSize:20,
    textAlign:'center'
  },
  price:{
    fontSize:20,
    textAlign:'center',
    marginBottom:10
  },
  stock:{
    fontSize:15,
    textAlign:'center'
  },
  quantityInput:{
    borderBottomWidth:1,
    textAlign:'center',
    fontSize:15,
    width:'15%'
  }
})