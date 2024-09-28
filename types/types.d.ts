interface Product {
    _id:string,
    posterDocId:string,
    productName:string,
    brandName:string | undefined,
    noBrand:boolean,
    manufacturer:string,
    productPrice:number,
    quantity:number,
    pictures:string[],
    productReviews:Array,
}
type Footer = {
    currentScreen:"Home" | "Search" | "Cart" | "Profile"
}
type ProductProps = {
    _id:string,
    picture:string,
    name:string,
    price:number
}
type ComponentProps = {
    Home:undefined,
    ProductDetails:{
        _id:string
    }
    SignIn:undefined,
    SignUp:undefined
}