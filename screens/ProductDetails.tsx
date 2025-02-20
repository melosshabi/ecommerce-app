import { Dimensions, Image, Pressable, StyleSheet, Text, TextInput, useColorScheme, View, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState, useTransition } from 'react'
import { DrawerScreenProps } from '@react-navigation/drawer'
import {URL, STRIPE_PUBLISHABLE_KEY} from "@env"
import colors from '../lib/colors'
import Footer from '../components/Footer'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming, } from 'react-native-reanimated'
import { addToCart, addToWishlist, removeFromCart, removeFromWishlist } from '../lib/lib'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StripeProvider, useStripe } from '@stripe/stripe-react-native'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import Loader from '../components/Loader'

type ProductDetails = DrawerScreenProps<ComponentProps, 'ProductDetails'>
const dvh = Dimensions.get("screen").height

export default function ProductDetails({route}:ProductDetails) {
    const darkMode = useColorScheme() === 'dark'
    const [productData, setProductData] = useState<Product | null>(null)
    const [imagesCount, setImagesCount] = useState(0)
    const [productExists, setProductExists] = useState<ProductExists>({wishlist:false, cart:false})
    const isFocused = useIsFocused()
    const [reqPending, setReqPending] = useState(true)
    useEffect(() => {
      if(!isFocused){
        setProductData(null)
        setImagesCount(0)
        setProductExists({wishlist:false, cart:false})
        setReqPending(true)
      }else{
        async function getProduct(){
          const res = await fetch(`${URL}/api/productDetails?_id=${route.params._id}`)
          const data:Product = await res.json()
          setProductData(data)
          setImagesCount(data.pictures.length)
        }
        // This function checks if the product is already saved on the user's wishlist or cart
        async function checkUserLists(){
          const session = await AsyncStorage.getItem('session')
          if(session){
            const req = await fetch(`${URL}/api/checkUserLists?_id=${route.params._id}`, {
              headers:{
                'Mobile':"True",
                "Authorization":`Bearer ${session}`
              }
            })
            const data = await req.json()
            if(data.productExists) setProductExists(data.productExists)
          }
        }
        getProduct().then(() => setReqPending(false))
        checkUserLists()
      }
    }, [isFocused])
    const [desiredQuantity, setDesiredQuantity] = useState("1")
    const [quantityError, setQuantityError] = useState(false)
    useEffect(() => {
      if(parseInt(desiredQuantity) > productData?.quantity!){
        setQuantityError(true)
      }else{
        setQuantityError(false)
      }
    }, [desiredQuantity])
    let quantity = '1'

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
    const picture3Opacity = useSharedValue(0)
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
    const [alertMessage, setAlertMessage] = useState("")
    const alertTranslate = useSharedValue(300)
    const alertAnim = useAnimatedStyle(() => {
      return {
        transform:[{translateX:alertTranslate.value}]
      }
    })
    async function handleListChanges(list:"Wishlist" | "Cart"){
      if(list === 'Cart'){
        if(!productExists?.cart){
          const success = await addToCart(productData?._id as string, parseInt(desiredQuantity))
            if(success){
              setAlertMessage("Added to cart")
              setProductExists(prev => ({...prev, cart:true}))
              showAlert()
            }
        }else{
          const success = await removeFromCart(productData?._id as string)
          if(success){
              setAlertMessage("Removed from cart")
              setProductExists(prev => ({...prev, cart:false}))
              showAlert()
          }
        }
      }
      else if(list === 'Wishlist'){
        if(!productExists?.wishlist){
          const success = await addToWishlist(productData?._id as string)
            if(success){
              setAlertMessage("Added to wishlist")
              setProductExists(prev => ({...prev, wishlist:true}))
              showAlert()
            }
        }else{
          const success = await removeFromWishlist(productData?._id as string)
          if(success){
            setAlertMessage("Removed from wishlist")
            setProductExists(prev => ({...prev, wishlist:false}))
            showAlert()
          }
        }
      }
    }
    const progressBarWidth = useSharedValue('100%')
    // @ts-ignore
    const progressBar = useAnimatedStyle(() => {
      return {
        width:progressBarWidth.value,
        height:3,
        backgroundColor:colors.orange,
        marginTop:5
      }
    })
    function showAlert(){
      alertTranslate.value = withTiming(-10, {duration:300, easing:Easing.elastic()})
      progressBarWidth.value = withTiming('0%', {duration:3000})
      setTimeout(() => {
        alertTranslate.value = withTiming(500, {duration:300, easing:Easing.elastic()})
      }, 3000)
      setTimeout(() =>{
        progressBarWidth.value = '100%'
      }, 3500)
    }
    const navigation = useNavigation()
    const {initPaymentSheet, presentPaymentSheet} = useStripe()
    async function fetchPaymentSheetParams(){
      const token = await AsyncStorage.getItem("session")
      const res = await fetch(`${URL}/api/orders`, {
        method:"POST",
        headers:{
          "Mobile":"true",
          "Authorization":`Bearer ${token}`
        },
        body:JSON.stringify({products:[{price:productData?.productPrice}]})
      })
      const data = await res.json()
      if(data.responseMessage === "jwt-expired"){
        Alert.alert("Session expired", "You need to sign in again", [
          {
            text:"Ok",
            style:"default",
            onPress:async () => {
                await AsyncStorage.removeItem("session")
                // @ts-ignore
                navigation.navigate("SignIn")
            }
          }
        ])
      }
      const {paymentIntent, ephemeralKey} = data
      return {paymentIntent, ephemeralKey}
    }
    async function initializePaymentSheet(){
      const {paymentIntent, ephemeralKey} = await fetchPaymentSheetParams()
      await initPaymentSheet({
        merchantDisplayName:"Mela Ecommerce",
        customerEphemeralKeySecret:ephemeralKey,
        paymentIntentClientSecret:paymentIntent,
      })
      const {error} = await presentPaymentSheet()
      if(error){
        console.log("ERROR: ", error)
        if(error.code === "Canceled") return
        Alert.alert("Something went wrong", "An unkown error occurred while trying to process your payment" ,[
          {
            text:"Ok",
            style:'default',
            onPress: () => {}
          }
        ])
        return
      }
      const session = await AsyncStorage.getItem('session')
      const res = await fetch(`${URL}/api/finishOrder`, {
        method:"POST",
        headers:{
          "Mobile":'true',
          "Authorization":`Bearer ${session}`,
        }
      })
      const data = await res.json()
      if(data.responseMessage === "jwt-expired"){
        Alert.alert("Session expired", "You need to sign in again", [
          {
            text:"Ok",
            style:"default",
            onPress:async () => {
                await AsyncStorage.removeItem("session")
                // @ts-ignore
                navigation.navigate("SignIn")
            }
          }
        ])
      }else if(data.responseMessage === 'order-placed'){
        setAlertMessage("Order successful")
        showAlert()
      }
    }
  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      {reqPending ? <Loader/> : <></>}
      <Animated.View style={[styles.productPage, darkMode && {backgroundColor:colors.black}]}>
        <ScrollView>
        <View>
          <View style={styles.slider}>
            <Pressable onPress={() => changeVisibleImage(activeImageIndex - 1)} style={({pressed}) => [styles.arrowButtons, pressed && darkMode ? {backgroundColor:colors.transparentWhite} : pressed && {backgroundColor:colors.black3}]}>
              <Image style={[styles.arrows, styles.leftArrow]} source={darkMode ? require('../images/arrow.png') : require("../images/arrowBlack.png")}/>
            </Pressable>
            <View style={styles.imagesWrapper}>
              <Animated.Image style={[styles.productImages,{zIndex:2}, picture1AnimStyle]} source={{uri:productData?.pictures[0]}}/>
              <Animated.Image style={[styles.productImages,{zIndex:1}, picture2AnimStyle]} source={{uri:productData?.pictures[1]}}/>
              <Animated.Image style={[styles.productImages,{zIndex:0}, picture3AnimStyle]} source={{uri:productData?.pictures[2]}}/>
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
          <AInput onBlur={() => handleQuantityInputFocus(false)} onFocus={() => handleQuantityInputFocus(true)} style={[styles.quantityInput, inputBorderAnim, darkMode ? {color:'white'} : {color:'black'}]} keyboardType='number-pad' defaultValue={desiredQuantity} onChangeText={text => quantity = text} onEndEditing={() => setDesiredQuantity(quantity)}/>
          {quantityError && <Text style={styles.quantityError}>Quantity too high</Text>}
          <Pressable onPress={() => handleListChanges("Cart")} style={({pressed}) => [styles.productButtons, darkMode ? {shadowColor:'white', elevation:4} : {shadowColor:'black', elevation:4}, pressed && {backgroundColor:colors.darkerOrange}]}>
            <Text style={styles.productButtonsText}>{!productExists?.cart ? 'Add To Cart' : 'Remove from cart'}</Text>
            <Image style={styles.buttonIcons} source={require("../images/cart.png")}/>
          </Pressable>
          <Pressable onPress={() => handleListChanges("Wishlist")} style={({pressed}) => [styles.productButtons, darkMode ? {shadowColor:'white', elevation:4} : {shadowColor:'black', elevation:4}, pressed && {backgroundColor:colors.darkerOrange}]}>
            <Text style={styles.productButtonsText}>{!productExists?.wishlist ? 'Add To Wishlist' : 'Remove from wishlist'}</Text>
            <Image style={styles.buttonIcons} source={require('../images/heart.png')}/>
          </Pressable>
          <Pressable onPress={initializePaymentSheet} style={({pressed}) => [styles.productButtons, darkMode ? {shadowColor:'white', elevation:4} : {shadowColor:'black', elevation:4}, pressed && {backgroundColor:colors.darkerOrange}]}><Text style={styles.productButtonsText}>Order Now</Text><Image style={styles.buttonIcons} source={require("../images/checkmark.png")}/></Pressable>
        </View>
        </ScrollView>
        <Animated.View style={[styles.alert, alertAnim, darkMode ? {backgroundColor:colors.black, borderWidth:1, borderColor:'white'} : {backgroundColor:'white', borderWidth:1, borderColor:'black'}]}>
          <View style={styles.checkmarkTextWrapper}>
            <Image style={styles.checkmark} source={darkMode ? require("../images/checkmark.png") : require('../images/checkmarkBlack.png')}/>
            <Text style={[styles.alertText, darkMode ? {color:'white'} : {color:'black'}]}>{alertMessage}</Text>
          </View>
          <Animated.View style={progressBar}></Animated.View>
        </Animated.View>
        <Footer currentScreen={undefined}/>
      </Animated.View>
    </StripeProvider>
  )
}

const styles = StyleSheet.create({
  productPage:{
    height:'100%',
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
    position:'relative',
    overflow:"hidden"
  },
  productImages:{
    width:'100%',
    height:'100%',
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
    width:'15%',
    marginBottom:15
  },
  quantityError:{
    color:'red',
    fontFamily:"WorkSans-Medium",
    fontSize:18,
    marginBottom:10
  },
  productButtons:{
    width:'68%',
    marginVertical:10,
    backgroundColor:colors.orange,
    paddingVertical:20,
    paddingHorizontal:25,
    borderRadius:8,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  productButtonsText:{
    fontSize:20,
    color:'white',
    fontFamily:"WorkSans-Medium"
  },
  buttonIcons:{
    width:25,
    height:25,
    marginLeft:5,
  },
  alert:{
    width:'50%',
    borderRadius:8,
    padding:8,
    position:'absolute',
    top:'83%',
    right:0
  },
  checkmarkTextWrapper:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-around',
  },
  checkmark:{
    width:35,
    height:35
  },
  alertText:{
    fontFamily:"WorkSans-Medium"
  }
})