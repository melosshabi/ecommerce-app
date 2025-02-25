import { FlatList, Image, StyleSheet, Text, useColorScheme, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import colors from '../lib/colors'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getMonthString } from '../lib/lib'
import Footer from '../components/Footer'
import { URL } from '@env'
import Loader from '../components/Loader'

export default function Orders() {
  const darkMode = useColorScheme() === 'dark'
  const [orders, setOrders] = useState<OrderData[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const navigation = useNavigation()
  const [reqPending, setReqPending] = useState(true)
  const isFocused = useIsFocused()
  useEffect(() => {
    const controller = new AbortController()
    if(isFocused){
      async function fetchOrders(){
        const session = await AsyncStorage.getItem("session")
        if(!session){
          // @ts-ignore
          navigation.navigate("SignIn", undefined)
        }
        const res = await fetch(`${URL}/api/orders`,
          {
            signal:controller.signal,
            headers:{
              "Mobile":"True",
              "Authorization":`Bearer ${session}`
            }
          })
            const data = await res.json()
            if(data.errCode === "unauthenticated"){
              // @ts-ignore
              navigation.navigate("SignIn", undefined)
              return
            }
            setOrders(prev => [...prev, ...data.userOrders])
            setProducts(prev => [...prev, ...data.products])
      }
      fetchOrders().then(() => setReqPending(false))
    }
    
    return () => controller.abort()
  }, [isFocused])
  return (
    <View style={[{height:'100%', justifyContent:'space-between'}, darkMode ? {backgroundColor:colors.black} : {backgroundColor:'white'}]}>
        {reqPending && <Loader/>}
        <Text style={[styles.title, darkMode ? {color:'white'} : {color:'black'}]}>My Orders</Text>
        { orders.length > 0 && products.length > 0 && 
        <FlatList
            data={orders}
            numColumns={1}
            style={{marginTop:10}}
            renderItem={({item, index}) => {
              const orderDate = new Date(item.createdAt)
              const year = orderDate.getFullYear()
              const month = getMonthString(orderDate.getMonth())
              const date = orderDate.getDate()
              return (
                <View style={[styles.product, darkMode ? {backgroundColor:colors.black, shadowColor:'white', elevation:4} : {backgroundColor:'white', shadowColor:'black', elevation:4}]}>
                  <View><Image style={styles.images} source={{uri:products[index].pictures[0]}}/></View>
                  <View style={styles.productData}>
                    <Text style={[styles.text, darkMode ? {color:'white'} : {color:'black'}]}>{products[index].productName}</Text>
                    <Text style={[styles.text, darkMode ? {color:'white'} : {color:'black'}]}>{products[index].manufacturer}</Text>
                    <Text style={[styles.text, darkMode ? {color:'white'} : {color:'black'}]}>{products[index].productPrice}€</Text>
                    <Text style={[styles.text, styles.date, darkMode ? {color:'white'} : {color:'black'}]}>{`${date}-${month}-${year}`}</Text>
                  </View>
                </View>
            )}
          } 
        />}
        <Footer currentScreen={undefined}/>
    </View>
  )
}

const styles = StyleSheet.create({
  title:{
    textAlign:'center',
    fontFamily:"WorkSans-Medium",
    fontSize:22,
    marginTop:5
  },
  product:{
    width:'95%',
    flexDirection:'row',
    marginLeft:'2.5%',
    marginVertical:10,
    borderRadius:12,
    paddingHorizontal:10,
    paddingVertical:20,
    position:'relative'
  },
  images:{
    width:100,
    height:100,
    borderRadius:12
  },
  productData:{
    width:'72%',
    marginLeft:'2%'
  },
  text:{
    fontFamily:"WorkSans-Medium",
    marginVertical:2,
  },
  date:{
    position:"absolute",
    bottom:-15,
    right:5
  }
})