import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { DrawerScreenProps } from '@react-navigation/drawer'
import {URL} from "@env"

type ProductDetails = DrawerScreenProps<ComponentProps, 'ProductDetails'>
export default function ProductDetails({route}:ProductDetails) {
    console.log(route.params._id)
    useEffect(() => {
        async function getProduct(){
            const res = await fetch(`${URL}/api/productDetails?_id=${route.params._id}`)
            const productData = await res.json()
            console.log(productData)
        }
        getProduct()
    }, [])
  return (
    <View>
      <Text>ProductDetails</Text>
    </View>
  )
}

const styles = StyleSheet.create({})