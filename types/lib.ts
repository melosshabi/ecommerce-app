import AsyncStorage from "@react-native-async-storage/async-storage"

export async function parseUserObj(){
    const data= await AsyncStorage.getItem("user")
    if(data){
        const user: DecodedToken = JSON.parse(data)
        return user
    }
    return null
}