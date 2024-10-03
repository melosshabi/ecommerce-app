import AsyncStorage from "@react-native-async-storage/async-storage"

export async function parseUserObj(){
    const data= await AsyncStorage.getItem("user")
    if(data){
        const user: DecodedToken = JSON.parse(data)
        return user
    }
    return null
}
export async function addToCart(productDocId:string, desiredQuantity:number){
    const session = await AsyncStorage.getItem('session')
    if(session){
        const res = await fetch(`http://10.0.2.2:3000/api/editCart`, {
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
        }else{
            return false
        }
    }
}