import axios from "axios";
import { ADD_TO_CART, FETCH_CART, REMOVE_CART_ITEM, UPDATE_CART_ITEM } from "../constants/cartConstant";
const apiUrl = process.env.REACT_APP_API_URL;

export const fetchCartItems = (alert) => async (dispatch) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found. User might not be logged in.");
            if (alert) alert.info("Please log in to access your cart.");
            return;
        }

        const response = await axios.get(
            "https://bite-cart.onrender.com/api/v1/eats/cart/get-cart",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const cartItems = response.data.data; // Assuming this is an array of cart items
        dispatch({
            type: FETCH_CART,
            payload: cartItems,
        });

        // 🛠️ Only show "Cart is empty" if the API response is valid but the cart is actually empty
        if (alert && Array.isArray(cartItems) && cartItems.length === 0) {
            alert.info("Cart is empty");
        }

    } catch (error) {
        console.error("Fetch cart error", error);

        if (alert) {
            alert.info("Failed to fetch cart. Please try again.");
        }
    }
};
//add to cart
export const addItemToCart=(foodItemId,restaurant,quantity,alert)=>async(dispatch,getState)=>{
    try {
      const {user,token} = getState().auth;//return the current store tree
      const config = {
        headers: { Authorization: `Bearer ${token}` }, // Attach Auth Token
    };
      const response=await axios.post("https://bite-cart.onrender.com/api/v1/eats/cart/add-to-cart",{
      userId: user._id,
      foodItemId,
      restaurantId: restaurant,
      quantity,
    },config);
    alert.success("Item added to Cart",response.data.cart);
    dispatch({
        type:ADD_TO_CART,
        payload:response.data.cart,
    });
}catch (error) {
    alert.error(error.response ? error.response.data.message : "Failed to add item to cart");
    }
};
//update cart item quantity
export const updateCartQuantity=(foodItemId,quantity,alert)=>async(dispatch,getState)=>{
    try {
        const {user,token}=getState().auth;
        if(typeof foodItemId==="object"){
            foodItemId=foodItemId._id;
        }
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const response =await axios.post("https://bite-cart.onrender.com/api/v1/eats/cart/update-cart-item",{
        userId:user._id,
        foodItemId:foodItemId,
        quantity,
        },config);
        dispatch({
            type:UPDATE_CART_ITEM,
            payload:response.data.cart,
        });
    } catch (error) {
        alert.error(error.response?error.response.data.message:error.message);
    }
};
//remove cart item 

export const removeItemFromCart=(foodItemId)=>async(dispatch ,getState)=>{
    try {
        const {user,token}=getState().auth;
        if(typeof foodItemId==="object"){
            foodItemId=foodItemId._id;
        }
        const config = {
            headers: { Authorization: `Bearer ${token}` },
            data: { userId: user._id, foodItemId }, // Axios `DELETE` method requires `data`
        };
            const response=await axios.delete(`https://bite-cart.onrender.com/api/v1/eats/cart/delete-cart-item`,config
            );
            dispatch({
                type:REMOVE_CART_ITEM,
                payload:response.data,

            });
        
    } catch (error) {
        alert.error(error.response?error.response.data.message:error.message);

    }
}
