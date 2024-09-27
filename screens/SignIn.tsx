import { Dimensions, Image, Pressable, StyleSheet, Text, TextInput, useColorScheme, View, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import colors from '../lib/colors'
import { Formik } from 'formik'
import * as yup from 'yup'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

const dvw = Dimensions.get('window').width
const dvh = Dimensions.get('window').height
export default function Signin() {
    const scheme = useColorScheme()

    const [formErrors, setFormErrors] = useState({
        username:'',
        password:''
    })
    const ATextInput = Animated.createAnimatedComponent(TextInput)
    const usernameBorderColor = useSharedValue(scheme === 'dark' ? 'white' : 'black',)
    const usernameBorderAnimStyle = useAnimatedStyle(() => {
        return {
            borderColor:usernameBorderColor.value,
        }
    }, [])
    const passwordBorderColor = useSharedValue(scheme === 'dark' ? 'white' : 'black',)
    const passwordBorderAnimStyle = useAnimatedStyle(() => {
        return {
            borderColor: passwordBorderColor.value
        }
    })
    const formMarginBottom = useSharedValue(50) 
    const formMarginBottomStyle = useAnimatedStyle(() => {
        return {
            marginBottom:formMarginBottom.value
        }
    })
    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', () => {
            formMarginBottom.value = withTiming(320, {duration:200})
        })
        Keyboard.addListener('keyboardDidHide', () => {
            formMarginBottom.value = withTiming(50, {duration:150})
        })
    }, [])
    const signInSchema = yup.object().shape({
        username:yup.string(),
        password:yup.string().min(8, "Incorrect password")
    })
    function handleBorderColorChange(field:string, focused:boolean){
        'worklet'
        if(focused && field === 'username'){
            usernameBorderColor.value = withTiming(colors.orange, {duration:150})
        }else if(!focused && field === 'username'){
            if(scheme === 'dark'){
                usernameBorderColor.value = withTiming('white', {duration:150})
            }else{
                usernameBorderColor.value = withTiming('black', {duration:150})
            }
        }else if(focused && field === 'password'){
            passwordBorderColor.value = withTiming(colors.orange, {duration:150})
        }else if(!focused && field === 'password'){
            if(scheme === 'dark'){
                passwordBorderColor.value = withTiming('white', {duration:150})
            }else{
                passwordBorderColor.value = withTiming('black', {duration:150})
            }
        }
    }
    async function signIn(email:string, password:string){

    }
return (
    <View style={[styles.homeScreen, {backgroundColor: scheme ? colors.black : 'white'}]}>
        <Text style={[styles.title]}>Welcome Back!</Text>
        <Image style={styles.backgroundImage} blurRadius={10} source={require('../images/decoration.jpg')}/>
        <View style={styles.imageForeground}></View>
        <Formik
            initialValues={{username:'', password:''}}
            validationSchema={signInSchema}
            onSubmit={values => signIn(values.username, values.password)}
        >
            {({handleChange, handleBlur, values, handleSubmit}) => (
            <Animated.View style={[styles.form, formMarginBottomStyle]} >
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
                        autoCapitalize='none'
                        style={[styles.inputs, usernameBorderAnimStyle]}
                        onFocus={() => handleBorderColorChange('username', true)}
                    />
                </View>
                 {/* Password */}
                <View style={styles.inputWrappers}>
                    <Image source={require('../images/passwordIcon.png')} style={styles.inputIcons}/>
                    <ATextInput
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
                <Pressable style={({pressed}) => [styles.signInBtn, pressed && {backgroundColor:colors.darkerOrange}]}>
                    <Text style={styles.signInBtnText}>Sign In</Text>
                </Pressable>
            </Animated.View>
            )}
            
        </Formik>
    </View>
)}

const styles = StyleSheet.create({
    homeScreen:{
        height:dvh - dvh / 14,
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