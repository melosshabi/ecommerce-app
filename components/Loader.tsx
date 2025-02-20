import { ActivityIndicator, Dimensions, View } from 'react-native'
import React from 'react'

const dvw = Dimensions.get('screen').width
const dvh = Dimensions.get('screen').height
export default function Loader() {
return (
    <View style={{width:dvw, height:dvh, justifyContent:'center', alignItems:'center', position:"absolute", top:0, left:0, backgroundColor:"black", zIndex:10}}>
        <ActivityIndicator size="large" color="#ffffff"/>
    </View>
)
}
