import React from "react";
import { studentEndpoints } from "../apis";
import toast from "react-hot-toast";
import {apiConnector} from "../apiconnector"
import rzpLogo from "../../assets/Logo/rzp_logo.png"
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice"

const {COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API} = studentEndpoints;


function loadScript(src){
    return new Promise((resolve)=>{
        const script = document.createElement("script");
        script.src = src;

        script.onload = ()=>{
            resolve(true);
        }
        script.onerror = ()=>{
            resolve(false);
        }
        document.body.appendChild(script);
    })
}

export async function buyCourse(token, courses, userDetails, navigate, dispatch) {
    const toastId = toast.loading("Loading");
    try{

        //load the script;
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if(!res){
            toast.error("RazorPay SDK failed to load");
        }

        //initaite the order
        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API,
                                                 {courses},
                                                 {
                                                    Authorization: `Bearer ${token}`
                                                 })
        console.log("orderResponse--->", orderResponse)                                         
        
        if(!orderResponse.data.success){
            throw new Error(orderResponse.data.message );
        }

        //options

        const options = {
            key: process.env.RAZORPAY_KEY,
            currency: orderResponse.data.message.currency,
            amount: orderResponse.data.message.amount,
            order_id: orderResponse.data.message.id,
            name: "StudyNotion",
            description: "Thank you for purchasing the course",
            image: rzpLogo,
            prefill: {
                name: userDetails?.firstName,
                email: userDetails?.email,
            },
            handler: function(response){
                //send success wala email
                sendPaymentSuccessfulEmail(response, orderResponse.data.message.amount, token); //orderResponse.data.data.amount wrong hai
                //verifyPayment
                verifyPayment({...response, courses}, token, navigate, dispatch);
            }
        }

        //miss hogaya tha
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment failed", function(response){
            toast.error("oops, payment failed");
            console.log(response.error);
        })


    }
    catch(err){
        console.log("PAYMENT API ERROR.......", err);
        toast.error("Could not make Payment")
    }
    toast.dismiss(toastId)
}

const sendPaymentSuccessfulEmail = async(response, amount, token)=>{
    try{
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount
        },{
            Authorization: `Bearer ${token}`
        })
    }
    catch(error){
        console.log("PAYMENT SUCCESS EMAIL ERROR", error)
    }
}


//verify payment
const verifyPayment = async(bodyData, token, navigate, dispatch)=>{
    const toastId = toast.loading("Verifying Payment");
    dispatch(setPaymentLoading(true))
    try{
        const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData
        ,{
            Authorization: `Bearer ${token}`
        })
        if(!response){
            throw new Error(response.data.message);
        }

        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart())
    }
    catch(error){
        console.log("VERFIY PAYMENT ERROR....", error);
        toast.error("Could not verify payment")
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false))
}





