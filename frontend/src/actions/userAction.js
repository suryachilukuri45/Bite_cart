import { CLEAR_CART } from "../constants/cartConstant";
import { CLEAR_ERRORS, FORGOT_PASSWORD_FAIL, FORGOT_PASSWORD_REQUEST, FORGOT_PASSWORD_SUCCESS, LOAD_USER_FAIL, LOAD_USER_REQUEST, LOAD_USER_SUCCESS, LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_FAIL, LOGOUT_SUCCESS, NEW_PASSWORD_FAIL, NEW_PASSWORD_REQUEST, NEW_PASSWORD_SUCCESS, REGISTER_USER_FAIL, REGISTER_USER_REQUEST, REGISTER_USER_SUCCESS, UPDATE_PASSWORD_FAIL, UPDATE_PASSWORD_REQUEST, UPDATE_PASSWORD_SUCCESS, UPDATE_PROFILE_FAIL, UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_SUCCESS } from "../constants/userConstant"
import axios from "axios";
//import Header from  "../components/layouts/Header";
//import { CLEAR_ERROR } from "../constants/restaurantConstant";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token"); // Modify based on where you store the token
    return {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        }
    };
};
export const login=(email,password)=>async (dispatch)=>{
    try{
        dispatch({type:LOGIN_REQUEST});
        const config={
                headers:{
                    "Content-Type":"application/json",
                },
        };
        const {data}=await axios.post(
            `https://bite-cart.onrender.com/api/v1/users/login`,
            {email,password},
            config
        );
        dispatch({
            type:LOGIN_SUCCESS,
            payload: data.data.user,
        });
        localStorage.setItem("token", data.token);
    }catch(error){
        dispatch ({
            type:LOGIN_FAIL,
            payload:"Login Failed",

        });
    }
};
//register
export const register=(userData)=>async (dispatch)=>{
    try{
        dispatch({type: REGISTER_USER_REQUEST});
        const config={
            headers:{"Content-Type": "multipart/form-data"},
        };
        const {data}=await axios.post(`https://bite-cart.onrender.com/api/v1/users/signup`,userData,config);
        dispatch({
            type:REGISTER_USER_SUCCESS,
            payload:data.data.user,

        });
        localStorage.setItem("token", data.token);
        return data.data.user;

    }
    catch(error){
        dispatch({
            type: REGISTER_USER_FAIL,
            payload:error.response.data.message,
        });
    }
};

//user actin
export const loadUser =() => async (dispatch)=>{
    try{
        dispatch({ type: LOAD_USER_REQUEST});
        const {data}=await axios.get(`https://bite-cart.onrender.com/api/v1/users/me`,getAuthHeaders());
        dispatch({
            type:LOAD_USER_SUCCESS,
            payload:data.user,
        });
    }catch(error){
        dispatch({
            type:LOAD_USER_FAIL,
            payload: error.response.data.message,
        });
    }
};
//uopdate user

export const updateProfile=(userData)=>async(dispatch)=>{
    try{
        dispatch({type: UPDATE_PROFILE_REQUEST})
        const config={
            headers:{
                "Content-Type":"multipart/form-data",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        };
        const {data}=await axios.put(
            "https://bite-cart.onrender.com/api/v1/users/me/update",
            userData,
            config
        );
        dispatch({type:UPDATE_PROFILE_SUCCESS,payload:data.success});
    }catch(error){
        dispatch({
            type:UPDATE_PROFILE_FAIL,
            payload:error.response.data.message,
        });
    }
};


//logout
export const logout=()=>async (dispatch)=>{
    try {
        await axios.get(`https://bite-cart.onrender.com/api/v1/users/logout`,getAuthHeaders());
        dispatch({
            type:LOGOUT_SUCCESS,
        });
        dispatch({type:CLEAR_CART});

        localStorage.removeItem("token");

    }catch (error){
        dispatch({
            type:LOGOUT_FAIL,
            payload: error.response.data.message,
        });
    }
};
//clear errors
export const clearErrors=()=>async(dispatch)=>{
    dispatch({
        type:CLEAR_ERRORS,
    });
};
export const updatePassword=(passwords)=>async (dispatch)=>{
try{
    dispatch({type:UPDATE_PASSWORD_REQUEST})
    // const config={
    //     headers:{
    //         "Content-Type":"application/json",
    //     },
    // };
    const {data}=await axios.put(
        "https://bite-cart.onrender.com/api/v1/users/password/update",
        passwords,
        getAuthHeaders()
    );
    dispatch({
        type:UPDATE_PASSWORD_SUCCESS,
        payload:data.success,

    });

}catch(error){
dispatch({
    type:UPDATE_PASSWORD_FAIL,
    payload:error.response.data.message,
});
}

};

export const forgotPassword=(email)=>async(dispatch)=>{
    try {
        dispatch({type:FORGOT_PASSWORD_REQUEST});
        const config={
            headers:{
                "Content-Type":"application/json",
            },
        };
        const {data}=await axios.post(
            "https://bite-cart.onrender.com/api/v1/users/forgetPassword",
            email,config
        );
        dispatch({
            type:FORGOT_PASSWORD_SUCCESS,
            payload:data.success,
        });
    } catch (error) {
        dispatch({
            type:FORGOT_PASSWORD_FAIL,
            payload:error.response.data.message,
        });
        
    }
};

//reset password

export const resetPassword=(token,passwords)=>async(dispatch)=>{
    try {
        dispatch({
            type:NEW_PASSWORD_REQUEST

        });
        // const config={
        //     headers:{
        //         "Content-Type":"application/json",
        // }
        // };
        const {data}=await axios.patch(`https://bite-cart.onrender.com/api/v1/users/resetPassword/${token}`,
        passwords,
        getAuthHeaders()
    );
    dispatch({
        type:NEW_PASSWORD_SUCCESS,
        payload:data.success,
    });
    } catch (error) {
        dispatch({
            type:NEW_PASSWORD_FAIL,
            payload:error.response.data.message,
        });
    }
};

