import { Dimensions, Image, Pressable, StyleSheet, Text, TextInput, useColorScheme, View, Keyboard, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
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
type SignUpParams = DrawerScreenProps<ComponentProps, 'SignUp'>
export default function Signup({route}:SignUpParams) {
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
    const emailBorderColor = useSharedValue('white')
    const emailBorderAnimStyle = useAnimatedStyle(() => {
        return{
            borderColor:emailBorderColor.value
        }
    }, [])
    const passwordBorderColor = useSharedValue('white')
    const passwordBorderAnimStyle = useAnimatedStyle(() => {
        return {
            borderColor: passwordBorderColor.value
        }
    }, [])
    const navigation = useNavigation()
    useEffect(() => {
        // @ts-ignore
        if(route.params.user) navigation.navigate("Home")
    }, [])
    const emailInputRef = useRef(null)
    const passwordInputRef = useRef(null)
    const signUpSchema = yup.object().shape({
        username:yup.string().min(4, "Username needs to be at least 4 characters long"),
        email:yup.string().email("Invalid Email"),
        password:yup.string().min(8, "Password needs to be at least 8 characters long")
    })
    function handleBorderColorChange(field:string, focused:boolean){
        'worklet'
        if(focused && field === 'username'){
            usernameBorderColor.value = withTiming(colors.orange, {duration:150})
        }else if(!focused && field === 'username'){
            usernameBorderColor.value = withTiming('white', {duration:150})
        }else if(focused && field == 'email') {
            emailBorderColor.value = withTiming(colors.orange, {duration:150})
        }else if(!focused && field == 'email'){
            emailBorderColor.value = withTiming('white', {duration:150})
        }else if(focused && field === 'password'){
            passwordBorderColor.value = withTiming(colors.orange, {duration:150})
        }else if(!focused && field === 'password'){
            passwordBorderColor.value = withTiming('white', {duration:150})
        }
    }
    const [authErr, setAuthErr] = useState("")
    async function signUp(username:string, email:string, password:string){
        const req = await fetch(`${URL}/api/signup`, {
            method:"POST",
            headers:{
                "Mobile":"true"
            },
            body:JSON.stringify({username, email, password})
        })
        const data = await req.json()
        if(req.status === 400){
            setAuthErr(data.errorMessage)
        }
        const decoded: DecodedToken = jwtDecode(data.session)

        await AsyncStorage.setItem("session", data.session)
        await AsyncStorage.setItem("user", JSON.stringify({
            _id:decoded._id,
            username:decoded.username,
            email:decoded.email,
            profilePictureUrl:decoded.profilePictureUrl,
            cartItemsCount:decoded.cartItemsCount
        }))
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
    <KeyboardAvoidingView behavior='height'>
    <View style={[styles.signUpScreen]}>
        <Text style={[styles.title]}>Welcome!</Text>
        <Image style={styles.backgroundImage} blurRadius={10} source={require('../images/decoration.jpg')}/>
        <View style={styles.imageForeground}></View>
        <Formik
            initialValues={{username:'', email:'', password:''}}
            validationSchema={signUpSchema}
            onSubmit={values => signUp(values.username, values.email, values.password)}
        >
            {({handleChange, handleBlur, values, errors, handleSubmit}) => (
            <View style={[styles.form]} >
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
                        onSubmitEditing={() => emailInputRef.current.focus()}
                    />
                </View>
                {/* Email */}
                <View style={styles.inputWrappers}>
                    <Image source={require('../images/at.png')} style={styles.inputIcons}/>
                    <ATextInput
                        ref={emailInputRef}
                        onChangeText={handleChange('email')}
                        onChange={() => {
                            if(formErrors.username) setFormErrors(prev => ({...prev, username:''}))
                        }}
                        onBlur={() => {
                            handleBorderColorChange('email', false)
                            handleBlur('email')
                        }}
                        value={values.email}
                        placeholder='Email'
                        placeholderTextColor='white'
                        autoCapitalize='none'
                        style={[styles.inputs, emailBorderAnimStyle]}
                        onFocus={() => handleBorderColorChange('email', true)}
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
                {errors.username && <Text style={styles.error}>{errors.username}</Text>}
                {errors.email && <Text style={styles.error}>{errors.email}</Text>}
                {errors.password && <Text style={styles.error}>{errors.password}</Text>}
                {authErr && <Text style={styles.error}>{authErr}</Text>}
                <Pressable onPress={() => handleSubmit()} style={({pressed}) => [styles.signInBtn, pressed && {backgroundColor:colors.darkerOrange}]}>
                    <Text style={styles.signUpButtonText}>Sign Up</Text>
                </Pressable>
            </View>
            )}
            
        </Formik>
    </View>
    </KeyboardAvoidingView>
)}

const styles = StyleSheet.create({
    signUpScreen:{
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
    signUpButtonText:{
        fontFamily:"WorkSans-Medium",
        color:'white',
        fontSize:20
    },
    error:{
        color:'red',
        fontFamily:'WorkSans-Medium',
        fontSize:15
    }
})