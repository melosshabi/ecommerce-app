import { Dimensions, Image, Pressable, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native'
import React, { useRef, useState } from 'react'
import colors from '../lib/colors'
import { Formik } from 'formik'
import * as yup from 'yup'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useNavigation } from '@react-navigation/native'
import { jwtDecode } from "jwt-decode";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerScreenProps } from '@react-navigation/drawer'
import { URL } from '@env'

const dvw = Dimensions.get('window').width
const dvh = Dimensions.get('window').height
type SignInParams = DrawerScreenProps<ComponentProps, "SignIn">

export default function Signin({route}:SignInParams) {
    const scheme = useColorScheme()

    const [formErrors, setFormErrors] = useState({
        username:'',
        password:''
    })
    const ATextInput = Animated.createAnimatedComponent(TextInput)
    const usernameBorderColor = useSharedValue('white')
    const usernameBorderAnimStyle = useAnimatedStyle(() => {
        return {
            borderColor:usernameBorderColor.value,
        }
    }, [])
    const passwordBorderColor = useSharedValue('white')
    const passwordBorderAnimStyle = useAnimatedStyle(() => {
        return {
            borderColor: passwordBorderColor.value
        }
    })
    const navigation = useNavigation()
    const passwordInputRef = useRef(null)
    const signInSchema = yup.object().shape({
        username:yup.string(),
        password:yup.string().min(8, "Incorrect password")
    })
    function handleBorderColorChange(field:string, focused:boolean){
        'worklet'
        if(focused && field === 'username'){
            usernameBorderColor.value = withTiming(colors.orange, {duration:150})
        }else if(!focused && field === 'username'){
            usernameBorderColor.value = withTiming('white', {duration:150})
        }else if(focused && field === 'password'){
            passwordBorderColor.value = withTiming(colors.orange, {duration:150})
        }else if(!focused && field === 'password'){
            passwordBorderColor.value = withTiming('white', {duration:150})
        }
    }   
    const [authInProgress, setAuthInProgress] = useState(false)
    async function signIn(username:string, password:string){
        setAuthInProgress(true)
        const req = await fetch(`${URL}/api/mobileAuth`, {
            method:"POST",
            body:JSON.stringify({username, password})
        })
        const data = await req.json()
        const decoded: DecodedToken = jwtDecode(data.session)

        await AsyncStorage.setItem("session", data.session)
        route.params.setUser({
            _id:decoded._id,
            username:decoded.username,
            email:decoded.email,
            profilePictureUrl:decoded.profilePictureUrl,
            cartItemsCount:decoded.cartItemsCount
        })
        // @ts-ignore
        navigation.navigate("Home")
    }
return (
    <View style={[styles.signInScreen, {backgroundColor: scheme ? colors.black : 'white'}]}>
        <Text style={[styles.title]}>Welcome Back!</Text>
        <Image style={styles.backgroundImage} blurRadius={10} source={require('../images/decoration.jpg')}/>
        <View style={styles.imageForeground}></View>
        <Formik
            initialValues={{username:'', password:''}}
            validationSchema={signInSchema}
            onSubmit={values => signIn(values.username, values.password)}
        >
            {({handleChange, handleBlur, values, handleSubmit}) => (
            <Animated.View style={[styles.form]} >
                {/* Username */}
                <View style={styles.inputWrappers}>
                    <Image source={require('../images/userIcon.png')} style={styles.inputIcons}/>
                    <ATextInput
                        onChangeText={handleChange('username')}
                        onChange={() => {
                            if(formErrors.username) setFormErrors(prev => ({...prev, username:''}))
                        }}
                        onBlur={() => {
                            handleBorderColorChange('username', false)
                            handleBlur('username')
                        }}
                        value={values.username}
                        placeholder='Username'
                        placeholderTextColor='white'
                        autoCapitalize='none'
                        style={[styles.inputs, usernameBorderAnimStyle]}
                        onFocus={() => handleBorderColorChange('username', true)}
                        returnKeyType="next"
                        // @ts-ignore
                        onSubmitEditing={() => passwordInputRef.current.focus()}
                    />
                </View>
                 {/* Password */}
                <View style={styles.inputWrappers}>
                    <Image source={require('../images/passwordIcon.png')} style={styles.inputIcons}/>
                    <ATextInput
                        ref={passwordInputRef}
                        onChangeText={handleChange('password')}
                        onChange={() => {
                            if(formErrors.username) setFormErrors(prev => ({...prev, username:''}))
                        }}
                        onBlur={() => {
                            handleBorderColorChange('password', false)
                            handleBlur('password')
                        }}
                        value={values.password}
                        placeholder='Password'
                        placeholderTextColor='white'
                        autoCapitalize='none'
                        style={[styles.inputs, passwordBorderAnimStyle]}
                        onFocus={() => handleBorderColorChange('password', true)}
                        secureTextEntry={true}
                    />
                </View>
                <Pressable disabled={authInProgress} onPress={() => handleSubmit()} style={({pressed}) => [styles.signInBtn, pressed && {backgroundColor:colors.darkerOrange}, authInProgress && {opacity:.7}]}>
                    <Text style={styles.signInBtnText}>{!authInProgress ? "Sign In" : "Signing In"}</Text>
                </Pressable>
            </Animated.View>
            )}
            
        </Formik>
    </View>
)}

const styles = StyleSheet.create({
    signInScreen:{
        height:'100%',
        alignItems:'center',
        justifyContent:'flex-end'
    },
    title:{
        textAlign:'center',
        fontSize:40,
        marginVertical:10,
        fontFamily:"WorkSans-SemiBold",
        marginBottom:70,
        color:'white'
    },
    backgroundImage:{
        width:dvw + dvw / 2,
        height:dvh,
        position:'absolute',
        zIndex:-2,
    },
    imageForeground:{
        width:dvw,
        height:dvh,
        backgroundColor:colors.black8,
        position:'absolute',
        zIndex:-1,
    },
    form:{
        width:dvw / 1.3,
        alignItems:'center',
        marginBottom:70
    },
    inputWrappers:{
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginVertical:12
    },
    inputs:{
        width:'85%',
        borderBottomWidth:1,
        color:'white'
    },
    inputIcons:{
        width:25,
        height:25
    },
    signInBtn:{
        width:'60%',
        backgroundColor:colors.orange,
        marginVertical:20,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:8,
        paddingVertical:10,
        shadowColor:'black',
        elevation:4,
        marginTop:60
    },
    signInBtnText:{
        fontFamily:"WorkSans-Medium",
        color:'white',
        fontSize:20
    }
})