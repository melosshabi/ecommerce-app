import { StyleSheet, Text, useColorScheme, View, ScrollView } from 'react-native'
import React, { useRef, useState } from 'react'
import colors from '../lib/colors'
import Footer from '../components/Footer'
import { Pressable, TextInput } from 'react-native-gesture-handler'
import * as yup from 'yup'
import { Formik } from 'formik'

export default function PostProduct() {
  const darkMode = useColorScheme() === 'dark'
  const productSchema = yup.object().shape({
    productName:yup.string().min(4, "Product name is too short"),
    brandName:yup.string().min(4, "Product name is too short").optional(),
    manufacturer:yup.string().min(2, 'Invalid manufacturer name'),
    price:yup.number(),
    quantity:yup.number().min(1),

  })
  const brandNameRef = useRef(null)
  const manufacturerRef = useRef(null)
  const priceRef = useRef(null)
  const quantityRef = useRef(null)

  async function uploadNewProduct(productData:NewProductData){
    console.log(productData)
  }
  return (
    <View style={[styles.postProductScreen, darkMode ? {backgroundColor:colors.black} : {backgroundColor:'white'}]}>
        <Text style={[styles.title, darkMode ? {color:'white'} : {color:'black'}]}>Start Selling</Text>
        <ScrollView style={{width:"70%"}}>
          <Formik
            initialValues={{productName:'', brandName:'', manufacturer:'', price:'', quantity:'1'}}
            validationSchema={productSchema}
            onSubmit={values => uploadNewProduct(values)}
          >
            {({values, handleChange, handleSubmit}) => (
              <View>
                <View style={styles.inputWrappers}>
                  <Text style={[styles.text, darkMode ? {color:'white'} : {color:'black'}]}>Product Name <Text style={styles.star}>*</Text></Text>
                  {/* {values.productName.e} */}
                  <TextInput 
                    // @ts-ignore
                    onSubmitEditing={() => brandNameRef.current.focus()} 
                    returnKeyType="next" value={values.productName} onChangeText={handleChange('productName')} style={[darkMode ? {borderBottomWidth:1, borderBottomColor:'white'} : {borderBottomWidth:1, borderBottomColor:'black'}]}/>
                </View>
                <View style={styles.inputWrappers}>
                  <Text style={[styles.text, darkMode ? {color:'white'} : {color:'black'}]}>Brand Name</Text>
                  <TextInput 
                    // @ts-ignore
                    onSubmitEditing={() => manufacturerRef.current.focus()}
                    ref={brandNameRef} returnKeyType="next" value={values.brandName} onChangeText={handleChange('brandName')} style={[darkMode ? {borderBottomWidth:1, borderBottomColor:'white'} : {borderBottomWidth:1, borderBottomColor:'black'}]}/>
                </View>
                <View style={styles.inputWrappers}>
                  <Text style={[styles.text, darkMode ? {color:'white'} : {color:'black'}]}>Manufacturer <Text style={styles.star}>*</Text></Text>
                  <TextInput
                    // @ts-ignore
                    onSubmitEditing={() => priceRef.current.focus()}
                    ref={manufacturerRef} returnKeyType="next" value={values.manufacturer} onChangeText={handleChange('manufacturer')} style={[darkMode ? {borderBottomWidth:1, borderBottomColor:'white'} : {borderBottomWidth:1, borderBottomColor:'black'}]}/>
                </View>
                <View style={styles.inputWrappers}>
                  <Text style={[styles.text, darkMode ? {color:'white'} : {color:'black'}]}>Price € <Text style={styles.star}>*</Text></Text>
                  <TextInput
                    // @ts-ignore
                    onSubmitEditing={() => quantityRef.current.focus()}
                    ref={priceRef} returnKeyType="next" value={values.price} onChangeText={handleChange('price')} style={[darkMode ? {borderBottomWidth:1, borderBottomColor:'white'} : {borderBottomWidth:1, borderBottomColor:'black'}]}/>
                </View>
                <View style={styles.inputWrappers}>
                  <Text style={[styles.text, darkMode ? {color:'white'} : {color:'black'}]}>Quantity <Text style={styles.star}>*</Text></Text>
                  <TextInput ref={quantityRef} returnKeyType="done" value={values.quantity} onChangeText={handleChange('quantity')} style={[darkMode ? {borderBottomWidth:1, borderBottomColor:'white'} : {borderBottomWidth:1, borderBottomColor:'black'}]}/>
                </View>

                <View style={styles.selectPicturesWrapper}>
                  <Text style={[styles.text, darkMode ? {color:'white'} : {color:'black'}]}>Pictures (1-3) <Text style={styles.star}>*</Text></Text>
                  <Pressable style={[styles.selectBtn, darkMode ? {shadowColor:'white', elevation:2} : {shadowColor:"black", elevation:4}]}>
                    <Text style={[styles.text, darkMode ? {color:'white'} : {color:'black'}]}>Select</Text>
                  </Pressable>
                  <Text style={[styles.text, {fontSize:14}, darkMode ? {color:'white'} : {color:'black'}]}>0 pictures selected</Text>
                </View>
                <Pressable onPress={() => handleSubmit()} style={[styles.selectBtn, styles.submitBtn, darkMode ? {shadowColor:'white', elevation:2} : {shadowColor:"black", elevation:4}]}>
                  <Text style={[styles.text, {fontSize:17}, darkMode ? {color:'white'} : {color:'black'}]}>Submit</Text>
                </Pressable>
              </View>
            )}
          </Formik>
        </ScrollView>
        <Footer currentScreen={undefined}/>
    </View>
  )
}

const styles = StyleSheet.create({
  postProductScreen:{ 
    height:'100%',
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
    marginVertical:20
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
  submitBtn:{
    width:'50%',
    alignSelf:'center',
    marginTop:30
  }
})