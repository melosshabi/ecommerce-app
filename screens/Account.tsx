import { Image, StyleSheet, Text, useColorScheme, View, Pressable, TextInput, Dimensions } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Footer from '../components/Footer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'
import colors from '../lib/colors'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Formik, } from 'formik'
import * as yup from 'yup'
import { URL } from '@env'

const dvh = Dimensions.get('screen').height
const dvw = Dimensions.get('screen').width
export default function Account() {
  const [user, setUser] = useState<DecodedToken | null>(null)
  let oldUsername = user?.username
  let oldEmail = user?.email
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
  const APressable = Animated.createAnimatedComponent(Pressable)
  const [editMode, setEditMode] = useState(false)
  const editProfileTranslate = useSharedValue(0)
  const editProfileAnim = useAnimatedStyle(() => {
    return {
      transform:[{translateY:editProfileTranslate.value}],
      zIndex:-2,
    }
  })
  const saveProfileTranslate = useSharedValue(500)
  const saveProfileAnim = useAnimatedStyle(() => {
    return {
      transform:[{translateY:saveProfileTranslate.value}],
      zIndex:-1
    }
  })
  const ATextInput = Animated.createAnimatedComponent(TextInput)
  const usernameBorderColor = useSharedValue(darkMode ? 'white' : 'black')
  const usernameBorderColorAnim = useAnimatedStyle(() => {
    return {
      borderColor:usernameBorderColor.value,
      borderBottomWidth:1,
    }
  })
  const emailBorderColor = useSharedValue(darkMode ? 'white' : 'black')
  const emailBorderColorAnim = useAnimatedStyle(() => {
    return {
      borderColor:emailBorderColor.value,
      borderBottomWidth:1
    }
  })
  function toggleEditMode(){
    if(!editMode){
      editProfileTranslate.value = withTiming(500, {duration:750, easing:Easing.elastic()})
      saveProfileTranslate.value = withTiming(0, {duration:750, easing:Easing.elastic()})
      setEditMode(true)
    }else{
      editProfileTranslate.value = withTiming(0, {duration:750, easing:Easing.elastic()})
      saveProfileTranslate.value = withTiming(500, {duration:750, easing:Easing.elastic()})
      setEditMode(false)
    }
  }
  enum inputs {
    username,
    email,
  }
  function toggleBorderAnimations(input:inputs, focused:boolean){
    if(focused && input === inputs.username){
      usernameBorderColor.value = withTiming(colors.orange, {duration:150})
    }else if(!focused && input === inputs.username){
      usernameBorderColor.value = withTiming('black', {duration:150})
    }else if(focused && input === inputs.email){
      emailBorderColor.value = withTiming(colors.orange, {duration:150})
    }else if(!focused && input === inputs.email){
      emailBorderColor.value = withTiming('black', {duration:150})
    }
  }
  const profileSchema = yup.object().shape({
    username:yup.string(),
    email:yup.string().email()
  })
  const alertTransform = useSharedValue(dvw)
  const alertOpacity = useSharedValue(0)
  const alertAnim = useAnimatedStyle(() => {
    return {
      transform:[{translateY:dvh - dvh / 3.5}, {translateX:alertTransform.value}],
      opacity:alertOpacity.value
    }
  })
  async function saveChanges(username:string, email:string){
    setEditMode(false)
    toggleBorderAnimations(inputs.username, false)
    toggleBorderAnimations(inputs.email, false)
    editProfileTranslate.value = withTiming(0, {duration:350})
    saveProfileTranslate.value = withTiming(500, {duration:350})
    const jwtToken = await AsyncStorage.getItem("session")
    const res = await fetch(`${URL}/api/updateUser`, {
      method:"PATCH",
      headers:{
        "Mobile":"true",
        "Authorization":`Bearer ${jwtToken}`
      },
      body:JSON.stringify({username, email})
    })
    const resData = await res.json()
    if(resData.msg === 'profile-updated'){
      alertTransform.value = withTiming(dvw - dvw / 2, {duration:450})
      alertOpacity.value = withTiming(1, {duration:350})
      
      setTimeout(() => {
        alertTransform.value = withTiming(dvw, {duration:450})
        alertOpacity.value = withTiming(0, {duration:350})
      }, 3000)
    }
  }
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
        {user && <Formik style={{ width: '80%' }}
          initialValues={{username:oldUsername, email:oldEmail}}
          validationSchema={profileSchema}
          onSubmit={values => saveChanges(values.username as string, values.email as string)}
        >
          {({handleChange, handleBlur, values, handleSubmit}) => (
          <View style={{width:'80%', alignItems:'center'}}>
            <View style={styles.inputWrappers}>
              <Text style={[styles.text, darkMode ? {color:'white'} : {color:'black'}]}>Username</Text>
              <Image style={styles.icons} source={darkMode ? require("../images/userIcon.png") : require('../images/userIconBlack.png')}/>
              <ATextInput onFocus={() => toggleBorderAnimations(inputs.username, true)}
                onBlur={() => toggleBorderAnimations(inputs.username, false)}
                style={[styles.inputs, usernameBorderColorAnim]}
                editable={editMode}
                value={values.username}
                onChangeText={handleChange('username')}
                />
            </View>
            <View style={styles.inputWrappers}>
              <Text style={[styles.text, darkMode ? {color:'white'} : {color:'black'}]}>Email</Text>
              <Image style={styles.icons} source={darkMode ? require("../images/at.png") : require('../images/atBlack.png')}/>
              <ATextInput onFocus={() => toggleBorderAnimations(inputs.email, true)}
                onBlur={() => toggleBorderAnimations(inputs.email, false)}
                style={[styles.inputs, emailBorderColorAnim]} 
                editable={editMode} 
                value={values.email}
                onChangeText={handleChange('email')}
                />
            </View>
              <APressable onPress={toggleEditMode} style={[styles.profileBtns, editProfileAnim, darkMode ? {shadowColor:'white', elevation:4} : {shadowColor:'black', elevation:4}]}>
                <Text style={styles.saveText}>Edit Profile</Text>
              </APressable>

              <APressable onPress={() => handleSubmit()} disabled={!editMode} style={[styles.profileBtns, saveProfileAnim, darkMode ? {shadowColor:'white', elevation:4} : {shadowColor:'black', elevation:4}]}>
              <Text style={styles.saveText}>Save Changes</Text>
            </APressable>
          </View>)}
        </Formik>}
      </View>
      {/* Account updated Alert */}
      <Animated.View style={[styles.accountAlert, alertAnim, darkMode ? {backgroundColor:colors.black, shadowColor:'white', elevation:4, borderWidth:1, borderColor:'white'} : {backgroundColor:'white', shadowColor:'black', elevation:4, borderWidth:1, borderColor:'black'}]}>
        <Image style={styles.checkmark} source={require('../images/checkmarkGreen.png')}/>
        <Text style={[styles.updatedText, darkMode ? {color:'white'} : {color:'black'}]}>Account Updated</Text>
      </Animated.View>

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
  profileBtns:{
    width:'60%',
    backgroundColor:colors.orange,
    paddingVertical:18,
    paddingHorizontal:25,
    borderRadius:10,
    marginTop:50,
  },
  saveText:{
    color:'white',
    fontSize:20,
    fontFamily:"WorkSans-Medium",
    textAlign:'center'
  },
  accountAlert:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    padding:10,
    borderRadius:8,
    position:'absolute',
  },
  checkmark:{
    width:35,
    height:35,
    marginRight:10
  },
  updatedText:{
    fontSize:15,
    fontFamily:"WorkSans-Medium"
  }
})