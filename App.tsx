import * as React from 'react';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';
import HamburgerButton from './components/HamburgerButton';
import { Dimensions, Image, Pressable, SafeAreaView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import colors from './lib/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState } from 'react';
// Screens
import Cart from './screens/Cart';
import SignIn from './screens/SignIn';
import Signup from './screens/SignUp';
import Wishlist from './screens/Wishlist';
import Account from './screens/Account';
import Search from './screens/Search';
import Home from './screens/Home';
import ProductDetails from './screens/ProductDetails';
import Orders from './screens/Orders';
import UserProducts from './screens/UserProducts';
import PostProduct from './screens/PostProduct';
import { jwtDecode } from 'jwt-decode';
import { updateJWT } from './lib/lib';

const dvh = Dimensions.get('screen').height
function drawerContent({navigation}:DrawerContentComponentProps, darkMode:boolean){
  const [user, setUser] = useState<DecodedToken | null>(null)
  useEffect(() => {
    async function updateUserObj(){
      const newToken = await updateJWT()
      if(newToken){
        const newUserData = jwtDecode(newToken)
        setUser(newUserData as DecodedToken)
      }
    }
    updateUserObj()
  },[])
  async function logOut(){
    setUser(null)
    await AsyncStorage.removeItem('session')
    navigation.closeDrawer()
    navigation.navigate("Home", {userLoggedOut:true})
  }
  return (
    <View style={[styles.drawer, darkMode ? {backgroundColor:colors.black} : {backgroundColor:'white'}]}>
      <View style={styles.avatarWrapper}>
          {user && 
            <>
              <Image style={styles.avatar} source={!user?.profilePictureUrl ? require ("./images/avatar.png"): {uri:user.profilePictureUrl}}/>
              <Text style={[styles.name, darkMode ? {color:'white'} : {color:'black'}]}>{user?.username}</Text>
            </>
          }
      </View>
      <View style={styles.options}>
          {user && 
          <Pressable onPress={() => navigation.navigate("Account")} style={({pressed}) => [styles.optionButtons, pressed && darkMode ? {backgroundColor:colors.transparentWhite}: pressed ? {backgroundColor:colors.black3} : {}]}>
              <Image source={darkMode ? require("./images/user.png") : require('./images/userBlack.png')} style={styles.optionIcons}/>
              <Text style={[styles.optionsText, darkMode ? {color:'white'} : {color:'black'}]}>My Account</Text>
          </Pressable>}
          <Pressable onPress={() => navigation.navigate('Cart')} style={({pressed}) => [styles.optionButtons, pressed && darkMode ? {backgroundColor:colors.transparentWhite}: pressed ? {backgroundColor:colors.black3} : {}]}>
              <Image style={styles.optionIcons} source={darkMode ? require("./images/cart.png") : require("./images/cartBlack.png")}/>
              <Text style={[styles.optionsText, darkMode ? {color:'white'} : {color:'black'}]}>Cart</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Wishlist')} style={({pressed}) => [styles.optionButtons, pressed && darkMode ? {backgroundColor:colors.transparentWhite}: pressed ? {backgroundColor:colors.black3} : {}]}>
              <Image style={styles.optionIcons} source={darkMode ? require("./images/heart.png") : require("./images/heartBlack.png")}/>
            <Text style={[styles.optionsText, darkMode ? {color:'white'} : {color:'black'}]}>Wishlist</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate("Orders")} style={({pressed}) => [styles.optionButtons, pressed && darkMode ? {backgroundColor:colors.transparentWhite}: pressed ? {backgroundColor:colors.black3} : {}]}>
              <Image style={styles.optionIcons} source={darkMode ? require("./images/orders.png") : require("./images/ordersBlack.png")}/>
            <Text style={[styles.optionsText, darkMode ? {color:'white'} : {color:'black'}]}>My Orders</Text>
          </Pressable>
          {user && 
          <Pressable onPress={() => navigation.navigate("UserProducts")} style={({pressed}) => [styles.optionButtons, pressed && darkMode ? {backgroundColor:colors.transparentWhite}: pressed ? {backgroundColor:colors.black3} : {}]}>
              <Image style={styles.optionIcons} source={darkMode ? require("./images/products.png") : require('./images/productsBlack.png')}/>
              <Text style={[styles.optionsText, darkMode ? {color:'white'} : {color:'black'}]}>My Products</Text>
          </Pressable>}
          {user && 
          <Pressable onPress={() => navigation.navigate("PostProduct")} style={({pressed}) => [styles.optionButtons, pressed && darkMode ? {backgroundColor:colors.transparentWhite}: pressed ? {backgroundColor:colors.black3} : {}]}>
            <Image style={styles.optionIcons} source={darkMode ? require("./images/money.png") : require('./images/moneyBlack.png')}/>
            <Text style={[styles.optionsText, darkMode ? {color:'white'} : {color:'black'}]}>Sell</Text>
          </Pressable> 
          }
      </View>
      {
        user ? <Pressable onPress={() => logOut()} style={({pressed}) => [styles.authButtons, pressed && darkMode ? {backgroundColor:colors.transparentWhite} : pressed ? {backgroundColor:colors.black3} : {}]}><Text style={styles.authText}>Sign Out</Text></Pressable> 
        : <View style={styles.authButtonsWrapper}>
          <Pressable onPress={() => navigation.navigate("SignIn", {user, setUser})} style={({pressed}) => [styles.authButtons, pressed && darkMode ? {backgroundColor:colors.transparentWhite} : pressed ? {backgroundColor:colors.black3} : {}]}><Text style={styles.authText}>Sign In</Text></Pressable> 
          <Pressable onPress={() => navigation.navigate("SignUp", {user, setUser})} style={({pressed}) => [styles.authButtons, pressed && darkMode ? {backgroundColor:colors.transparentWhite} : pressed ? {backgroundColor:colors.black3} : {}]}><Text style={styles.authText}>Sign Up</Text></Pressable> 
        </View>
      }
    </View>
  )
}
const Drawer = createDrawerNavigator<ComponentProps>()
export default function App() {
  const scheme = useColorScheme()
  return (
      <SafeAreaView style={{flex:1}}>
        <NavigationContainer>
          <Drawer.Navigator backBehavior="history" initialRouteName='Home' screenOptions={{drawerPosition:'right', 
            headerRight: () => <HamburgerButton/>, 
            headerStyle:{
              backgroundColor: scheme === 'dark' ? colors.black : 'white',
              elevation:5,
              shadowColor: scheme === 'dark' ? 'white' : colors.black
            },
            headerLeft:() => <Image style={styles.cartLogo} source={require("./images/cartLogo.png")}/>,
            headerTitleStyle:{
              color: scheme === 'dark' ? 'white' : colors.black,
            },
            title:'',
          }
        } 
          drawerContent={props => drawerContent(props, scheme === 'dark')} >
            <Drawer.Screen name="Home" component={Home}/>
            <Drawer.Screen name="ProductDetails" component={ProductDetails}/>
            <Drawer.Screen name="Search" component={Search}/>
            <Drawer.Screen name="SignIn" component={SignIn}/>
            <Drawer.Screen name="SignUp" component={Signup}/>
            <Drawer.Screen name="Cart" component={Cart}/>
            <Drawer.Screen name="Wishlist" component={Wishlist}/>
            <Drawer.Screen name="Account" component={Account}/>
            <Drawer.Screen name="Orders" component={Orders}/>
            <Drawer.Screen name="UserProducts" component={UserProducts}/>
            <Drawer.Screen name="PostProduct" component={PostProduct}/>
          </Drawer.Navigator>
        </NavigationContainer>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cartLogo:{
    width:65,
    height:65,
    margin:"auto",
  },
  drawer:{
    height:dvh - dvh / 17,
    justifyContent:'space-between',
    alignItems:'center',
    shadowColor:colors.orange,
    elevation:4,
    borderLeftWidth:1,
    borderLeftColor:colors.orange
  },
  avatarWrapper:{
    alignItems:'center'
  },
  avatar:{
    width:100,
    height:100,
    marginVertical:10,
    borderRadius:50
  },
  name:{
    fontFamily:"WorkSans-Medium",
    fontSize:25
  },
  options:{
    width:'100%',
    justifyContent:'flex-start',
    alignItems:'center',
  },
  optionsText:{
    width:'50%',
    fontSize:15,
    fontFamily:"Poppins-SemiBold",
  },
  optionButtons:{
    width:'100%',
    flexDirection:'row',
    alignItems:'center',
    marginVertical:1,
    paddingVertical:14,
  },
  iconWrappers:{
    width:50,
    height:50,
    justifyContent:'center',
    alignItems:'center',
  },
  optionIcons:{
    width:30,
    height:30,
    marginRight:25,
    marginLeft:10
  },
  authButtonsWrapper:{
    width:'100%',
    flexDirection:'row',
    justifyContent:'space-between'
  },
  authButtons:{
    marginBottom:20,
    paddingVertical:4,
    paddingHorizontal:8,
    borderRadius:8,
  },
  authText:{
    fontSize:20,
    color:colors.orange,
    fontFamily:"Poppins-SemiBold"
  }
})