import { Image, StyleSheet, Text, useColorScheme, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import { Pressable, TextInput } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'
import colors from '../lib/colors'

export default function Account() {
  const [user, setUser] = useState<DecodedToken | null>(null)
  const darkMode = useColorScheme() === 'dark'
  useEffect(() => {
    async function getUserObj(){
      const token = await AsyncStorage.getItem('session')
      if(token){
        const userData = jwtDecode(token)
        setUser(userData as DecodedToken)
      }
    }
    getUserObj()
  }, [])
  
  return (
    <View style={[styles.accountScreen, darkMode ? {backgroundColor:colors.black} : {backgroundColor:'white'}]}>
      <View style={styles.pfpWrapper}>
        <Image style={styles.pfp} source={user ? {uri:user?.profilePictureUrl} : require('../images/avatar.png')}/>
        <Pressable style={({pressed}) => [styles.uploadBtn, pressed && {backgroundColor:colors.darkerOrange},darkMode ? {shadowColor:'white', elevation:4} : {shadowColor:'black', elevation:4}]}>
          <Text style={styles.uploadText}>Upload new Picture</Text>
        </Pressable>
      </View>
      {/* Account Information */}
      <View style={styles.accountInfo}>
        <Text style={[styles.title, darkMode ? {color:'white'} : {color:'black'}]}>Account Information</Text>
        <View style={{width:'80%'}}>
          <View style={styles.inputWrappers}>
            <Text style={[styles.text, darkMode ? {color:'white'} : {color:'black'}]}>Username</Text>
            <Image style={styles.icons} source={darkMode ? require("../images/userIcon.png") : require('../images/userIconBlack.png')}/>
            <TextInput style={[styles.inputs, darkMode ? {borderBottomWidth:1, borderColor:'white'} : {borderBottomWidth:1, borderColor:"black"}]} editable={false} value={user?.username}/>
          </View>
          <View style={styles.inputWrappers}>
            <Text style={[styles.text, darkMode ? {color:'white'} : {color:'black'}]}>Email</Text>
            <Image style={styles.icons} source={darkMode ? require("../images/at.png") : require('../images/atBlack.png')}/>
            <TextInput style={[styles.inputs, darkMode ? {borderBottomWidth:1, borderColor:'white'} : {borderBottomWidth:1, borderColor:"black"}]} editable={false} value={user?.email}/>
          </View>
        </View>
        <Pressable style={({pressed}) => [styles.saveBtn, darkMode ? {shadowColor:'white', elevation:4} : {shadowColor:'black', elevation:4}, pressed && {backgroundColor:colors.darkerOrange}]}>
          <Text style={styles.saveText}>Save Changes</Text>
        </Pressable>
      </View>
      <Footer currentScreen={"Account"}/>
    </View>
  )
}

const styles = StyleSheet.create({
  accountScreen:{
    height:'100%',
    justifyContent:'space-between'
  },
  pfpWrapper:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-around',
    marginTop:20
  },
  pfp:{
    width:100,
    height:100,
  },
  uploadBtn:{
    backgroundColor:colors.orange,
    paddingVertical:10,
    paddingHorizontal:15,
    borderRadius:8
  },
  uploadText:{
    color:'white',
    fontFamily:"WorkSans-Medium"
  },
  accountInfo:{
    alignItems:'center'
  },
  title:{
    fontSize:30,
    fontFamily:"WorkSans-Medium"
  },
  text:{
    fontSize:15,
    fontFamily:"WorkSans-Medium",
    position:'absolute',
    left:'20%'
  },
  inputWrappers:{
    width:'100%',
    flexDirection:'row',
    paddingTop:20,
    marginVertical:30
  },
  icons:{
    width:40,
    height:40,
    marginRight:20
  },
  inputs:{
    width:'80%'
  },
  saveBtn:{
    backgroundColor:colors.orange,
    paddingVertical:18,
    paddingHorizontal:25,
    borderRadius:10,
    marginTop:100,
    marginBottom:-100
  },
  saveText:{
    color:'white',
    fontSize:20,
    fontFamily:"WorkSans-Medium",
  }
})