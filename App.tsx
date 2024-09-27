import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SignIn from './screens/SignIn';
import HamburgerButton from './components/HamburgerButton';
import { Image, SafeAreaView, StyleSheet, useColorScheme } from 'react-native';
import colors from './lib/colors';

const Drawer = createDrawerNavigator();

export default function App() {
  const scheme = useColorScheme()
  return (
    <SafeAreaView style={{flex:1}}>
    <NavigationContainer>
      <Drawer.Navigator screenOptions={{drawerPosition:'right', 
        headerRight: () => <HamburgerButton/>, 
        headerStyle:{
          backgroundColor: scheme === 'dark' ? colors.black : 'white',
          elevation:14,
          shadowColor:colors.black
        },
        headerLeft:() => <Image style={styles.cartLogo} source={require("./images/cartLogo.png")}/>,
        headerTitleStyle:{
          color: scheme === 'dark' ? 'white' : colors.black,
          
        },
        title:''
      }} >
        <Drawer.Screen name="Home" component={SignIn}/>
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
  }
})