import { URL } from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage"

export async function addToCart(productDocId:string, desiredQuantity:number){
    const session = await AsyncStorage.getItem('session')
    if(session){
        const res = await fetch(`${URL}/api/editCart`, {
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
    }else{
        const stringCart = await AsyncStorage.getItem("cart")
        if(stringCart){
            const cart = JSON.parse(stringCart)
            let productExists = false
            cart.forEach((product:LocalWishlistItem) => {
                if(product.productDocId === productDocId){
                    productExists = true
                }
            })
            if(productExists) return
            cart.push({productDocId, desiredQuantity})
            await AsyncStorage.setItem("cart", JSON.stringify(cart))
            return true
        }else{
            const cart = [{productDocId, desiredQuantity}]
            await AsyncStorage.setItem("cart", JSON.stringify(cart))
            return true
        }
    }
}
export async function removeFromCart(productDocId:string){
    const session = await AsyncStorage.getItem('session')
    if(session){
        const res = await fetch(`${URL}/api/editCart`, {
            method:"DELETE",
            headers:{
                "Mobile":"true",
                "Authorization":`Bearer ${session}`,
            },
            body:JSON.stringify({
                itemsToRemove:[productDocId]
            })
        })
        const parsedRes = await res.json()
        if(parsedRes.msg === 'products-deleted'){
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
    }else{
        const stringWishlist = await AsyncStorage.getItem("wishlist")
        if(stringWishlist){
            const wishlist = JSON.parse(stringWishlist)
            let productExists = false
            wishlist.forEach((product:LocalWishlistItem) => {
                if(product.productDocId === productDocId){
                    productExists = true
                }
            })
            if(productExists) return
            wishlist.push({productDocId})
            await AsyncStorage.setItem("wishlist", JSON.stringify(wishlist))
            return true
        }else{
            const wishlist = [{productDocId}]
            await AsyncStorage.setItem("wishlist", JSON.stringify(wishlist))
            return true
        }
    }
}
export async function removeFromWishlist(productDocId:string){
    const session = await AsyncStorage.getItem('session')
    if(session){
        const res = await fetch(`${URL}/api/wishlist`, {
            method:"DELETE",
            headers:{
                "Mobile":"true",
                "Authorization":`Bearer ${session}`,
            },
            body:JSON.stringify({
                itemsToRemove:[productDocId]
            })
        })
        const parsedRes = await res.json()
        if(parsedRes.msg === 'products-deleted'){
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
export function getMonthString(month:number){
    switch(month){
        case 0:
            return "Jan"
        case 1:
            return "Feb"
        case 2:
            return "Mar"
        case 3: 
            return "Apr"
        case 4:
            return "May"
        case 5:
            return "Jun"
        case 6:
            return "Jul"
        case 7:
            return "Aug"
        case 8:
            return "Sep"
        case 9:
            return "Oct"
        case 10:
            return "Nov"
        case 11:
            return "Dec"
    }
}
