import react, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { apiConnector } from "../../services/apiconnector";
import { contactusEndpoint } from "../../services/apis";
import CountryCode from "../../data/countrycode.json"


const ContactUsForm = ()=>{

    const [loading, setLoading] = useState(false)
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitSuccessful}
    } = useForm();

    useEffect( ()=>{
        if(isSubmitSuccessful){
            reset({
                email:"",
                firstName: "",
                lastName: "",
                message: "",
                phoneNo: ""
            })
        }
    }, [reset, isSubmitSuccessful] );

    const submitContactForm = async(data)=>{
        console.log("Logging data", data);
        try{
            setLoading(true);
            // const response = await apiConnector("POST", contactusEndpoint.CONTACT_US_API, data );
            const response = {status: "Ok"};
            console.log("Logging response -----> ", response);

            // if(!response.data.success){
            //     throw new Error(response.data.message)
            // }

            setLoading(false);
        }
        catch(error){
            console.log("Error occurred", error.message);
            setLoading(false);
        }
    }


    return(
        <form onSubmit={handleSubmit(submitContactForm)}>
            <div className="flex flex-col p-2">
            <div className="flex gap-5 mb-2">

                {/* FirstName */}
                <div className="flex w-full flex-col">
                    <label className="text-[14px] leading-[22px] text-[#F1F2FF] font-medium " htmlFor="firstName">
                        First Name
                    </label>
                    <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    placeholder="Enter your first name"
                    className="bg-[#161D29]  text-sm mt-1 text-[#999DAA] font-medium w-full p-3 rounded-lg"
                    style={{
                        boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                    }}
                    {...register("firstName", {required: true})}
                    />
                    {
                        errors.firstName && (
                            <span>
                                Please enter your name
                            </span>
                        )
                    }
                </div>

                {/* LastName */}
                <div className="flex w-full flex-col">
                    <label  className="text-[14px] leading-[22px] text-[#F1F2FF] font-medium " htmlFor="lastName">
                        Last Name
                    </label>
                    <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    placeholder="Enter your last name"
                    className="bg-[#161D29]  text-sm mt-1 text-[#999DAA] font-medium w-full p-3 rounded-lg"
                    style={{
                        boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                      }} 
                    {...register("lastName")}
                    />
                </div>

            </div>

            {/* Email */}

            <div className="flex flex-col mb-2"> 
                <label className="text-[14px] leading-[22px] text-[#F1F2FF] font-medium " htmlFor="email">Email Address</label>
                <input type="email"
                id="email"
                placeholder="Enter your Email Address"
                name="email"
                className="bg-[#161D29]  text-sm mt-1 text-[#999DAA] font-medium w-full p-3 rounded-lg"
                style={{
                 boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                { ...register("email", { required: true }) }
                />
                {
                    errors.email && (
                        <span>
                            Please enter your email address
                        </span>
                    )
                }
            </div>

            {/* Phone Number */}
            <div className="flex w-full flex-col gap-2 mb-2">

                <label className="text-[14px] leading-[22px] text-[#F1F2FF] font-medium " htmlFor="phoneNo">
                    Phone Number
                </label>

                <div className="flex flex-col md:flex-row gap-5">
                    {/* Dropdowm */}
                    
                    <select
                        name="dropdown"
                        id="dropdown"
                        className="bg-[#161D29]  text-sm mt-1 text-[#999DAA] font-medium  p-3 rounded-lg md:w-[15%] "
                        style={{
                        boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                         }}
                        { ...register("countrycode", { required:true }) }
                        >
                        {
                            CountryCode.map((element, idx)=>{
                                return(
                                    <option key={idx} value={element.code}>
                                        {element.code} - {element.country}
                                    </option>
                                )
                            })
                        }    
                    </select>
                    
                    <input
                        type="number"
                        name="phoneNo"
                        id="phoneNo"
                        placeholder="12345 67890"
                        className="bg-[#161D29]  text-sm mt-1 text-[#999DAA] font-medium w-full p-3 rounded-lg"
                        style={{
                        boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                        }}
                        { ...register("phoneNo",
                            {required:{value: true, message: "Please enter phone number"},
                            maxLength: {value:15, message: "Invalid phone number"}, 
                            minLength: {value: 8, message: "Invalid phone Number"}
                        })}
                    />
                    {
                        errors.phoneNo && (
                            <span>
                                {errors.phoneNo.message}
                            </span>
                            )
                    }
                </div>

            </div>

            {/* Message */}
            <div className="flex flex-col mb-3">
                <label className="text-[14px] leading-[22px] text-[#F1F2FF] font-medium " htmlFor="message">Message</label>
                <textarea 
                name="message" 
                id="message"
                placeholder="Enter your message"
                cols={"30"}
                rows={"7"}
                className="bg-[#161D29]  text-sm mt-1 text-[#999DAA] font-medium w-full p-3 rounded-lg"
                style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                { ...register("message", {required:true})  }
                />
                {
                    errors.message && (
                        <span>
                            Please enter your message
                        </span>
                    )
                }
            </div>

            {/* Button */}
            <button type="submit" className="rounded-md bg-yellow-50 text-center text-sm   px-6 py-3 font-semibold text-[#000814] " >
                Send message
            </button>

            </div>
        </form>
    )
}


export default ContactUsForm