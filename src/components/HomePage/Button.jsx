import React from "react";
import { Link } from "react-router-dom";

const Button = ({ children, active, linkto }) => {
    return (
        <Link to={linkto} className="w-full md:w-auto">
            <div className={`
                text-center px-8 py-4 text-[15px] md:text-[13px] sm:text-[12px] rounded-md font-bold
                ${active ? "bg-yellow-50 text-black" : "bg-richblack-800 text-white"}
                hover:scale-95 transition-all duration-200 
                md:px-6 md:py-3 sm:px-4 sm:py-2
                flex items-center justify-center
            `}>
                {children}
            </div>
        </Link>
    );
};

export default Button;
