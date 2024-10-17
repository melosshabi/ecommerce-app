import { URL } from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage"

export async function addToCart(productDocId:string, desiredQuantity:number){
    const session = await AsyncStorage.getItem('session')
    if(session){
        const res = await fetch(`${process.env.URL}/api/editCart`, {
            method:"PATCH",
            headers:{
                "Mobile":"true",
                "Authorization":`Bearer ${session}`,
                "Action":"add-new"
            },
            body:JSON.stringify({
                productDocId,
                desiredQuantity,
            })
        })
        const parsedRes = await res.json()
        if(parsedRes.msg === 'added-to-cart'){
            return true
        }
        return false
    }
}
export async function addToWishlist(productDocId:string){
    const session = await AsyncStorage.getItem('session')
    if(session){
        const res = await fetch(`${URL}/api/wishlist`, {
            method:"PATCH",
            headers:{
                "Mobile":"true",
                "Authorization":`Bearer ${session}`,
            },
            body:JSON.stringify({
                productDocId,
            })
        })
        const parsedRes = await res.json()
        if(parsedRes.messageCode === 'added-to-wishlist'){
            return true
        }
        return false
    }
}
export async function updateJWT(){
    const oldJWT = await AsyncStorage.getItem("session")
    if(oldJWT){
        const res = await fetch(`${URL}/api/mobileAuth`, {
            method:"PATCH",
            body:JSON.stringify({token:oldJWT})
        })
        const data = await res.json()
        await AsyncStorage.setItem("session", data.newToken)
        return data.newToken
    }
}