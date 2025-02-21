import { StyleSheet, Text, useColorScheme, View, ScrollView, Image} from 'react-native'
import React, { useRef, useState } from 'react'
import colors from '../lib/colors'
import Footer from '../components/Footer'
import { Pressable, TextInput } from 'react-native-gesture-handler'
import * as yup from 'yup'
import { Formik } from 'formik'
import { Asset, launchImageLibrary } from 'react-native-image-picker'
import Animated, { BounceInRight, BounceOutRight, useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function PostProduct() {
  const darkMode = useColorScheme() === 'dark'
  const productSchema = yup.object().shape({
    productName:yup.string().min(4, "Product name is too short"),
    brandName:yup.string().min(4, "Brand name is too short").optional(),
    manufacturer:yup.string().min(3, 'Manufacturer name is too short'),
    price:yup.number().min(1, "Invalid Price"),
    quantity:yup.number().min(1, "Invalid quantity"),
  })
  const brandNameRef = useRef(null)
  const manufacturerRef = useRef(null)
  const priceRef = useRef(null)
  const quantityRef = useRef(null)

  const [productPictures, setProductPictures] = useState<Asset[]>([])
  const [pictureError, setPictureError] = useState("")
  function openImagePicker(){
    launchImageLibrary({mediaType:"photo", includeBase64:true, selectionLimit:3}, res => {
      if(res.assets){
        setProductPictures([...res.assets])
      }
    })
  }
  const [uploadInProgress, setUploadInProgress] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  async function uploadNewProduct(productData:NewProductData, setValues:({}:any) => void){
    if(!productData.productName || !productData.manufacturer || !productData.price || !productData.quantity) return
    if(productPictures.length === 0){
      setPictureError("Select at least 1 picture")
      return
    }
    setUploadInProgress(true)
    const pictureBase64s: string[] = []
    productPictures.forEach(picture => pictureBase64s.push(picture.base64 as string))
    const token = await AsyncStorage.getItem("session")
    const res = await fetch(`${URL}/api/newProduct`, {
      method:"POST",
      headers:{
        "Mobile":"true",
        "Authorization":`Bearer ${token}`
      },
      body:JSON.stringify({
        productName:productData.productName,
        brandName:productData.brandName,
        manufacturer:productData.manufacturer,
        productPrice:productData.price,
        quantity:productData.quantity,
        pictures:pictureBase64s
      })
    })
    const data = await res.json()
    if(data.msg === "product-uploaded"){
      setUploadInProgress(false)
      setProductPictures([])
      setValues({productName:"", brandName:"", manufacturer:"", price:"1", quantity:"1"})
      setShowNotification(true)
      setTimeout(() => {
        setShowNotification(false)
      }, 3000)
    }
  }
  const keyboard = useAnimatedKeyboard()
  
  const screenAnimStyle = useAnimatedStyle(() => ({
    marginBottom:keyboard.height.value
  }))
  return (
    <Animated.View style={[styles.postProductScreen, screenAnimStyle, darkMode ? {backgroundColor:colors.black} : {backgroundColor:'white'}]}>
        <Animated.Text style={[styles.title, darkMode ? {color:'white'} : {color:'black'}]}>Start Selling</Animated.Text>
        <ScrollView style={{width:"100%"}} contentContainerStyle={{alignItems:'center'}}>
          <Formik
            initialValues={{productName:'', brandName:'', manufacturer:'', price:'', quantity:'1'}}
            validationSchema={productSchema}
            onSubmit={(values, {setValues}) => uploadNewProduct(values, setValues)}
          >
            {({values, errors, handleChange, handleSubmit}) => (
              <Animated.View style={[{width:'70%'}]}>
                <View style={styles.inputWrappers}>
                  <Text style={[styles.text, darkMode ? {color:'white'} : {color:'black'}]}>Product Name <Text style={styles.star}>*</Text></Text>
                  <TextInput 
                    editable={!uploadInProgress}
                    // @ts-ignore
                    onSubmitEditing={() => brandNameRef.current.focus()} 
                    returnKeyType="next" value={values.productName} onChangeText={handleChange('productName')} style={[darkMode ? {color:"white", borderBottomWidth:1, borderBottomColor:'white'} : {color:"black", borderBottomWidth:1, borderBottomColor:'black'}]}/>
                    {errors.productName && <Text style={styles.errors}>{errors.productName}</Text>}
                </View>
                <View style={styles.inputWrappers}>
                  <Text style={[styles.text, darkMode ? {color:'white'} : {color:'black'}]}>Brand Name</Text>
                  <TextInput 
                    editable={!uploadInProgress}
                    // @ts-ignore
                    onSubmitEditing={() => manufacturerRef.current.focus()}
                    ref={brandNameRef} returnKeyType="next" value={values.brandName} onChangeText={handleChange('brandName')} style={[darkMode ? {color:"white", borderBottomWidth:1, borderBottomColor:'white'} : {color:"black", borderBottomWidth:1, borderBottomColor:'black'}]}/>
                    {errors.brandName && <Text style={styles.errors}>{errors.brandName}</Text>}
                </View>
                <View style={styles.inputWrappers}>
                  <Text style={[styles.text, darkMode ? {color:'white'} : {color:'black'}]}>Manufacturer <Text style={styles.star}>*</Text></Text>
                  <TextInput
                    editable={!uploadInProgress}
                    // @ts-ignore
                    onSubmitEditing={() => priceRef.current.focus()}
                    ref={manufacturerRef} returnKeyType="next" value={values.manufacturer} onChangeText={handleChange('manufacturer')} style={[darkMode ? {color:"white", borderBottomWidth:1, borderBottomColor:'white'} : {color:"black", borderBottomWidth:1, borderBottomColor:'black'}]}/>
                    {errors.manufacturer && <Text style={styles.errors}>{errors.manufacturer}</Text>}
                </View>
                <View style={styles.inputWrappers}>
                  <Text style={[styles.text, darkMode ? {color:'white'} : {color:'black'}]}>Price € <Text style={styles.star}>*</Text></Text>
                  <TextInput
                    editable={!uploadInProgress}
                    inputMode="numeric"
                    // @ts-ignore
                    onSubmitEditing={() => quantityRef.current.focus()}
                    ref={priceRef} returnKeyType="next" value={values.price} onChangeText={handleChange('price')} style={[darkMode ? {color:"white", borderBottomWidth:1, borderBottomColor:'white'} : {color:"black", borderBottomWidth:1, borderBottomColor:'black'}]}/>
                    {errors.price && <Text style={styles.errors}>{errors.price}</Text>}
                </View>
                <View style={styles.inputWrappers}>
                  <Text style={[styles.text, darkMode ? {color:'white'} : {color:'black'}]}>Quantity <Text style={styles.star}>*</Text></Text>
                  <TextInput editable={!uploadInProgress} inputMode="numeric" enabled={!uploadInProgress} ref={quantityRef} returnKeyType="done" value={values.quantity} onChangeText={handleChange('quantity')} style={[darkMode ? {color:"white", borderBottomWidth:1, borderBottomColor:'white'} : {color:"black", borderBottomWidth:1, borderBottomColor:'black'}]}/>
                  {errors.quantity && <Text style={styles.errors}>{errors.quantity}</Text>}
                </View>

                <View style={styles.selectPicturesWrapper}>
                  <Text style={[styles.text, darkMode ? {color:'white'} : {color:'black'}]}>Pictures (1-3) <Text style={styles.star}>*</Text></Text>
                  <Pressable disabled={uploadInProgress} onPress={openImagePicker} style={({pressed}) => [styles.selectBtn, darkMode ? {shadowColor:'white', elevation:2} : {shadowColor:"black", elevation:4}, pressed || uploadInProgress ? {backgroundColor:colors.darkerOrange} : {}]}>
                    <Text style={[styles.text, darkMode ? {color:'white'} : {color:'black'}]}>Select</Text>
                  </Pressable>
                  {
                    productPictures.length > 0 && 
                      <View style={{flexDirection:'row'}}>
                        {productPictures[0] && <Image style={styles.productImages} source={{uri:productPictures[0].uri}}/>}
                        {productPictures[1] && <Image style={styles.productImages} source={{uri:productPictures[1].uri}}/>}
                        {productPictures[2] && <Image style={styles.productImages} source={{uri:productPictures[2].uri}}/>}
                      </View>
                  }
                  {pictureError && <Text style={styles.errors}>{pictureError}</Text>}
                  <Text style={[styles.text, {fontSize:14}, darkMode ? {color:'white'} : {color:'black'}]}>{productPictures.length} pictures selected</Text>
                </View>
                <Pressable disabled={uploadInProgress} onPress={() => handleSubmit()} style={({pressed}) => [styles.selectBtn, styles.submitBtn, darkMode ? {shadowColor:'white', elevation:2} : {shadowColor:"black", elevation:4}, pressed || uploadInProgress ? {backgroundColor:colors.darkerOrange} : {}]}>
                  <Text style={[styles.text, {fontSize:17}, darkMode ? {color:'white'} : {color:'black'}]}>Submit</Text>
                </Pressable>
              </Animated.View>
            )}
          </Formik>
        </ScrollView>
          {
            showNotification &&
            <Animated.View entering={BounceInRight} exiting={BounceOutRight} style={[styles.notification, darkMode ? {backgroundColor:colors.black, borderWidth:1, borderColor:'white'} : {backgroundColor:'white', borderWidth:1, borderColor:'black'}]}>
              <Image style={styles.checkmark} source={darkMode ? require('../images/checkmark.png') : require("../images/checkmarkBlack.png")}/>
              <Text style={[styles.notifText, darkMode ? {color:'white', textShadowColor:'black', textShadowRadius:3} : {color:'black', textShadowColor:'white', textShadowRadius:3}]}>Product Uploaded</Text>
            </Animated.View>
          }
        <Footer currentScreen={undefined}/>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  postProductScreen:{ 
    // height:'100%',
    flex:1,
    justifyContent:'space-between',
    alignItems:'center'
  },
  title:{
    fontSize:22,
    fontFamily:"WorkSans-Medium",
    marginVertical:10
  },
  text:{
    fontFamily:"WorkSans-Medium",
    textAlign:'center'
  },
  star:{
    color:'red'
  },
  inputWrappers:{
    marginVertical:20,
  },
  selectPicturesWrapper:{
    alignItems:'center'
  },
  selectBtn:{
    backgroundColor:colors.orange,
    width:'30%',
    paddingVertical:8,
    borderRadius:8,
    marginVertical:20
  },
  productImages:{
    width:60,
    height:60,
    margin:5,
  },
  errors:{
    color:'red',
    textAlign:'center',
    marginVertical:5
  },
  submitBtn:{
    width:'50%',
    alignSelf:'center',
    marginTop:30
  },
  notification:{
    flexDirection:'row',
    alignItems:'center',
    padding:15,
    borderRadius:8,
    position:'absolute',
    bottom:60,
    right:10
  },
  checkmark:{
    width:35,
    height:35,
    marginRight:5
  },
  notifText:{
    fontFamily:"WorkSans-Medium"
  }
})