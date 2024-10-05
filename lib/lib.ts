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
        }else{
            return false
        }
    }
}