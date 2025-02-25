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
    createdAt:Date
}
type Footer = {
    currentScreen:"Home" | "Search" | "Cart" | "Wishlist" | "Profile" | "Account" |  undefined,
    userLoggedOut?:boolean
}
type ProductProps = {
    _id:string,
    picture:string,
    name:string,
    price:number,
    animationFunction:(option:"Cart" | "Wishlist") => void
}
type ComponentProps = {
    Home:undefined | {userLoggedOut:boolean}
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
    Account:undefined,
    Orders:undefined,
    UserProducts:undefined,
    PostProduct:undefined
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
    // Avaiable quantity of a product
    quantity:number,
    desiredQuantity:number,
    dateAddedToCart:Date,
    pictures:string[]
}
type WishlistItem = {
    _id: string
    productDocId:string,
    productName:string,
    manufacturer:string,
    productPrice:number,
    productImage:string,
    pictures:string[]
}
// Type for the wishlist of unauth users
type LocalWishlistItem = {
    productDocId:string
}
type LocalCartItem = {
    productDocId:string,
    desiredQuantity:number
}
type ProductExists = {
    wishlist:boolean,
    cart:boolean
}
type OrderData = {
    _id:string,
    clientDocId:string,
    productDocId:string,
    desiredQuantity:number,
    productPrice:number,
    totalPrice:number,
    createdAt:string
}
type NewProductData = {
    productName:string,
    brandName?:string,
    manufacturer:string,
    price:string
    quantity:string,
}