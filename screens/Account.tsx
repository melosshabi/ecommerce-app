import { Image, StyleSheet, Text, useColorScheme, View, Pressable, TextInput, Dimensions } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Footer from '../components/Footer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'
import colors from '../lib/colors'
import Animated, { Easing, useAnimatedKeyboard, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Formik, } from 'formik'
import * as yup from 'yup'
import { URL } from '@env'
import {Asset, launchImageLibrary} from 'react-native-image-picker'
import { useNavigation } from '@react-navigation/native'
import { updateJWT } from '../lib/lib'

const dvh = Dimensions.get('screen').height
const dvw = Dimensions.get('screen').width
export default function Account() {
  const navigation = useNavigation()
  const [jwtToken, setJwtToken] = useState("")
  const [user, setUser] = useState<DecodedToken | null>(null)
  let oldUsername = user?.username
  let oldEmail = user?.email
  const darkMode = useColorScheme() === 'dark'
  useEffect(() => {
    async function getUserObj(){
      const token = await AsyncStorage.getItem('session')
      if(token){
        setJwtToken(token)
        const userData = jwtDecode(token)
        setUser(userData as DecodedToken)
      }else{
        // @ts-ignore
        navigation.navigate("Home", undefined)
      }
    }
    getUserObj()
  }, [])
  const [newProfilePicture, setNewProfilePicture] = useState<Asset | null>(null)
  function openImagePicker(){
    launchImageLibrary({mediaType:"photo", includeBase64:true}, res => {
      if(res.assets){
        setNewProfilePicture(res.assets[0])
      }
    })
  }
  async function uploadNewPicture(){
    const formData = new FormData()
    formData.append('username', user?.username)
    formData.append('email', user?.email)
    formData.append('profilePicture', newProfilePicture?.base64)
    setNewProfilePicture(null)
    setUser(prev => ({...prev, profilePictureUrl:newProfilePicture?.uri} as DecodedToken))
    alertTransform.value = withTiming(dvw - dvw / 1.9, {duration:450, easing:Easing.elastic()})
    alertOpacity.value = withTiming(1, {duration:350, easing:Easing.elastic()})
    progressBarWidth.value = withTiming('0%', {duration:3000})
    setTimeout(() => {
      progressBarWidth.value = '100%'
    }, 3400)
    setTimeout(() => {
      alertTransform.value = withTiming(dvw, {duration:450, easing:Easing.elastic()})
      alertOpacity.value = withTiming(0, {duration:350, easing:Easing.elastic()})
    }, 3000)
    const res = await fetch(`${URL}/api/updateUser`, {
      method:"PATCH",
      headers:{
        "Mobile":"true",
        "Authorization":`Bearer ${jwtToken}`,
        "Content-Type":"multipart/form-data"
      },
      body:formData
    })
    const data = await res.json()
    if(data.msg === 'profile-updated'){
      const newJWT = await updateJWT()
      const newUserData = jwtDecode(newJWT)
      setUser(newUserData as DecodedToken)
    }
  }
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
      usernameBorderColor.value = withTiming(darkMode ? 'white' : 'black', {duration:150})
    }else if(focused && input === inputs.email){
      emailBorderColor.value = withTiming(colors.orange, {duration:150})
    }else if(!focused && input === inputs.email){
      emailBorderColor.value = withTiming(darkMode ? 'white' : 'black', {duration:150})
    }
  }
  const profileSchema = yup.object().shape({
    username:yup.string(),
    email:yup.string().email()
  })
  const alertTransform = useSharedValue(dvw)
  const alertOpacity = useSharedValue(1)
  const alertAnim = useAnimatedStyle(() => {
    return {
      transform:[{translateY:dvh - dvh / 3.2}, {translateX:alertTransform.value}],
      opacity:alertOpacity.value
    }
  })
  const progressBarWidth = useSharedValue('100%')
  // @ts-ignore
  const progressBarAnim = useAnimatedStyle(() => {
    return {
      width:progressBarWidth.value
    }
  })
  async function saveChanges(username:string, email:string){
    setEditMode(false)
    toggleBorderAnimations(inputs.username, false)
    toggleBorderAnimations(inputs.email, false)
    editProfileTranslate.value = withTiming(0, {duration:750, easing:Easing.elastic()})
    saveProfileTranslate.value = withTiming(500, {duration:350, easing:Easing.elastic()})
    alertTransform.value = withTiming(dvw - dvw / 1.9, {duration:450})
    alertOpacity.value = withTiming(1, {duration:350})
    progressBarWidth.value = withTiming('0%', {duration:3000})
    setTimeout(() => {
      progressBarWidth.value = '100%'
    }, 3400)
    setTimeout(() => {
      alertTransform.value = withTiming(dvw, {duration:450})
      alertOpacity.value = withTiming(0, {duration:350})
    }, 3000)
    const formData = new FormData()
    formData.append('username', username)
    formData.append('email', email)
    const jwtToken = await AsyncStorage.getItem("session")
    const res = await fetch(`${URL}/api/updateUser`, {
      method:"PATCH",
      headers:{
        "Mobile":"true",
        "Authorization":`Bearer ${jwtToken}`
      },
      body:formData
    })
    const resData = await res.json()
    if(resData.msg === 'profile-updated'){
      const newJWT = await updateJWT()
      setUser(jwtDecode(newJWT))
    }
  }
  function cancelImageChange(){
    setNewProfilePicture(null)
  }
  const emailInput = useRef(null)
  const keyboard = useAnimatedKeyboard()
  const screenTranslateAnim = useAnimatedStyle(() => {
    return {
      transform:[{translateY:-keyboard.height.value / 2}],
    }
  })
  return (
    <Animated.View style={[styles.accountScreen, screenTranslateAnim, darkMode ? {backgroundColor:colors.black} : {backgroundColor:'white'}]}>
      <View style={styles.pfpWrapper}>
        <View>
          {/* Cancel Image Change */}
          {newProfilePicture && <Pressable onPress={() => cancelImageChange()} style={[styles.cancelBtn, darkMode ? {backgroundColor:colors.black, borderWidth:1, borderColor:'white'} : {backgroundColor:'white', borderWidth:1, borderColor:'black'}]}>
            <Image style={styles.xIcon} source={require('../images/x.png')}/>
          </Pressable>}
          <Image style={styles.pfp} source={user && !newProfilePicture ? {uri:user?.profilePictureUrl} : user && newProfilePicture ? {uri:newProfilePicture.uri} : require('../images/avatar.png')}/>
        </View>
        <View>
          <Pressable onPress={() => openImagePicker()} style={({pressed}) => [styles.pictureBtns, pressed && {backgroundColor:colors.darkerOrange},darkMode ? {shadowColor:'white', elevation:4} : {shadowColor:'black', elevation:4}]}>
            <Text style={styles.uploadText}>Upload new Picture</Text>
          </Pressable>
          {
            newProfilePicture && 
            <Pressable onPress={() => uploadNewPicture()} style={({pressed}) => [styles.pictureBtns, pressed && {backgroundColor:colors.darkerOrange},darkMode ? {shadowColor:'white', elevation:4} : {shadowColor:'black', elevation:4}]}>
              <Text style={styles.uploadText}>Save new Picture</Text>
            </Pressable>
          }
        </View>
      </View>
      {/* Account Information */}
      <View style={styles.accountInfo}>
        <Text style={[styles.title, darkMode ? {color:'white'} : {color:'black'}]}>Account Information</Text>
        {user && <Formik style={{ width: '80%' }}
          initialValues={{username:oldUsername, email:oldEmail}}
          validationSchema={profileSchema}
          onSubmit={values => saveChanges(values.username as string, values.email as string)}
        >
          {({handleChange, values, handleSubmit}) => (
          <View style={{width:'80%', alignItems:'center'}}>
            <View style={styles.inputWrappers}>
              <Text style={[styles.text, darkMode ? {color:'white'} : {color:'black'}]}>Username</Text>
              <Image style={styles.icons} source={darkMode ? require("../images/userIcon.png") : require('../images/userIconBlack.png')}/>
              <ATextInput onFocus={() => toggleBorderAnimations(inputs.username, true)}
                onBlur={() => toggleBorderAnimations(inputs.username, false)}
                style={[styles.inputs, usernameBorderColorAnim, darkMode ? {color:'white'} : {color:'black'}]}
                editable={editMode}
                value={values.username}
                onChangeText={handleChange('username')}
                returnKeyType="next"
                // @ts-ignore
                onSubmitEditing={() => emailInput.current.focus()}
                />
            </View>

            <View style={styles.inputWrappers}>
              <Text style={[styles.text, darkMode ? {color:'white'} : {color:'black'}]}>Email</Text>
              <Image style={styles.icons} source={darkMode ? require("../images/at.png") : require('../images/atBlack.png')}/>
              <ATextInput onFocus={() => toggleBorderAnimations(inputs.email, true)}
                onBlur={() => toggleBorderAnimations(inputs.email, false)}
                style={[styles.inputs, emailBorderColorAnim, darkMode ? {color:'white'} : {color:'black'}]} 
                editable={editMode} 
                value={values.email}
                onChangeText={handleChange('email')}
                ref={emailInput}
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
        <View style={styles.checkmarkTextWrapper}>
          <Image style={styles.checkmark} source={darkMode ? require('../images/checkmark.png') : require('../images/checkmarkBlack.png')}/>
          <Text style={[styles.updatedText, darkMode ? {color:'white'} : {color:'black'}]}>Account Updated</Text>
        </View>
        <Animated.View style={[styles.progressBar, progressBarAnim]}></Animated.View>
      </Animated.View>

      <Footer currentScreen={"Account"}/>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  accountScreen:{
    minHeight:'93%',
    justifyContent:'space-between'
  },
  pfpWrapper:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-around',
    paddingVertical:20
  },
  pfp:{
    width:100,
    height:100,
    borderRadius:50
  },
  pictureBtns:{
    backgroundColor:colors.orange,
    paddingVertical:10,
    paddingHorizontal:15,
    borderRadius:8,
    marginVertical:5
  },
  uploadText:{
    color:'white',
    fontFamily:"WorkSans-Medium",
    textAlign:'center'
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
    width:'65%',
    backgroundColor:colors.orange,
    paddingVertical:18,
    paddingHorizontal:25,
    borderRadius:10,
  },
  saveText:{
    color:'white',
    fontSize:20,
    fontFamily:"WorkSans-Medium",
    textAlign:'center'
  },
  accountAlert:{
    justifyContent:'flex-end',
    alignItems:'center',
    padding:10,
    borderRadius:8,
    position:'absolute',
  },
  checkmarkTextWrapper:{
    flexDirection:'row',
    alignItems:'center'
  },
  checkmark:{
    width:35,
    height:35,
    marginRight:10
  },
  updatedText:{
    fontSize:15,
    fontFamily:"WorkSans-Medium"
  },
  progressBar:{
    height:3,
    backgroundColor:colors.orange,
    marginTop:10,
    marginLeft:1,
    alignSelf:'flex-start'
  },
  cancelBtn:{
    position:'absolute',
    left:'65%',
    top:'-10%',
    width:40,
    height:40,
    zIndex:1,
    borderRadius:50,
    justifyContent:'center',
    alignItems:'center'
  },
  xIcon:{
    width:40,
    height:40
  }
})