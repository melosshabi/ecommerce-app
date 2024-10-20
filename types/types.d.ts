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
    currentScreen:"Home" | "Search" | "Cart" | "Profile" | "Account" | undefined
}
type ProductProps = {
    _id:string,
    picture:string,
    name:string,
    price:number,
    animationFunction:(option:"Cart" | "Wishlist") => void
}
type ComponentProps = {
    Home:undefined,
    ProductDetails:{
        _id:string
    }
    SignIn:{
        user:DecodedToken | null,
        setUser:React.Dispatch<React.SetStateAction<DecodedToken | null>>
    },
    SignUp:{
        user:DecodedToken | null,
        setUser:React.Dispatch<React.SetStateAction<DecodedToken | null>>
    },
    Search:undefined,
    Cart:undefined,
    Wishlist:undefined,
    Account:undefined
}
type DecodedToken = {
    _id:string,
    username:string,
    email:string,
    profilePictureUrl:string,
    cartItemsCount:number
}
type CartItem = {
    _id:string,
    productName:string,
    productImage:string,
    manufacturer:string,
    productPrice:number,
    availableQuantity:number,
    desiredQuantity:number,
    dateAddedToCart:Date
}
type WishlistItem = {
    productDocId:string,
    productName:string,
    manufacturer:string,
    productPrice:number,
    productImage:string
}
type ProductExists = {
    wishlist:boolean,
    cart:boolean
}