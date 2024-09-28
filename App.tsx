import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';
import SignIn from './screens/SignIn';
import HamburgerButton from './components/HamburgerButton';
import { Dimensions, Image, Pressable, SafeAreaView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import colors from './lib/colors';
import Home from './screens/Home';
import ProductDetails from './screens/ProductDetails';

const dvh = Dimensions.get('screen').height
function drawerContent({navigation}:DrawerContentComponentProps, darkMode:boolean){
  return (
    <View style={[styles.drawer, darkMode ? {backgroundColor:colors.black} : {backgroundColor:'white'}]}>
      <View style={styles.avatarWrapper}>
        <Image style={styles.avatar} source={require("./images/avatar.png")}/>
        <Text style={[styles.name, darkMode ? {color:'white'} : {color:'black'}]}>Melos Shabi</Text>
      </View>
      <View style={styles.options}>
          <Pressable style={({pressed}) => [styles.optionButtons, pressed && darkMode ? {backgroundColor:colors.transparentWhite}: pressed ? {backgroundColor:colors.black3} : {}]}>
            <View style={styles.iconWrappers}>
              <Image source={darkMode ? require("./images/user.png") : require('./images/userBlack.png')} style={styles.optionIcons}/>
            </View>
              <Text style={[styles.optionsText, darkMode ? {color:'white'} : {color:'black'}]}>My Account</Text>
          </Pressable>
          <Pressable style={({pressed}) => [styles.optionButtons, pressed && darkMode ? {backgroundColor:colors.transparentWhite}: pressed ? {backgroundColor:colors.black3} : {}]}>
            <View style={styles.iconWrappers}>
              <Image style={styles.optionIcons} source={darkMode ? require("./images/cart.png") : require("./images/cartBlack.png")}/>
            </View>
            <Text style={[styles.optionsText, darkMode ? {color:'white'} : {color:'black'}]}>Cart</Text></Pressable>
          <Pressable style={({pressed}) => [styles.optionButtons, pressed && darkMode ? {backgroundColor:colors.transparentWhite}: pressed ? {backgroundColor:colors.black3} : {}]}>
            <View style={styles.iconWrappers}>
              <Image style={styles.optionIcons} source={darkMode ? require("./images/heart.png") : require("./images/heartBlack.png")}/>
            </View>
            <Text style={[styles.optionsText, darkMode ? {color:'white'} : {color:'black'}]}>Wishlist</Text></Pressable>
          <Pressable style={({pressed}) => [styles.optionButtons, pressed && darkMode ? {backgroundColor:colors.transparentWhite}: pressed ? {backgroundColor:colors.black3} : {}]}>
            <View style={styles.iconWrappers}>
              <Image style={styles.optionIcons} source={darkMode ? require("./images/orders.png") : require("./images/ordersBlack.png")}/>
            </View>
            <Text style={[styles.optionsText, darkMode ? {color:'white'} : {color:'black'}]}>My Orders</Text></Pressable>
          <Pressable style={({pressed}) => [styles.optionButtons, pressed && darkMode ? {backgroundColor:colors.transparentWhite}: pressed ? {backgroundColor:colors.black3} : {}]}>
            <View style={styles.iconWrappers}>
              <Image style={styles.optionIcons} source={darkMode ? require("./images/products.png") : require('./images/productsBlack.png')}/>
            </View>
            <Text style={[styles.optionsText, darkMode ? {color:'white'} : {color:'black'}]}>My Products</Text></Pressable>
      </View>
      <Pressable style={({pressed}) => [styles.authButtons, pressed && darkMode ? {backgroundColor:colors.transparentWhite} : pressed ? {backgroundColor:colors.black3} : {}]}><Text style={styles.authText}>Sign Out</Text></Pressable>
    </View>
  )
}
const Drawer = createDrawerNavigator<ComponentProps>();

export default function App() {
  const scheme = useColorScheme()
  return (
    <SafeAreaView style={{flex:1}}>
    <NavigationContainer>
      <Drawer.Navigator initialRouteName='Home' screenOptions={{drawerPosition:'right', 
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
        title:''
      }} 
      drawerContent={props => drawerContent(props, scheme === 'dark')} >
        <Drawer.Screen name="SignIn" component={SignIn}/>
        <Drawer.Screen name="Home" component={Home}/>
        <Drawer.Screen name="ProductDetails" component={ProductDetails}/>
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
    marginVertical:10
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
    marginVertical:5,
    paddingVertical:4,
  },
  iconWrappers:{
    width:50,
    height:50,
    justifyContent:'center',
    alignItems:'center',
  },
  optionIcons:{
    transform:[{scale:.3}],
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