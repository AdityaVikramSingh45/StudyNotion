import React from "react";
import CTAButton from "./Button";
import { FaArrowRight } from "react-icons/fa6";
import { TypeAnimation } from "react-type-animation";

const CodeBlock = ({
    position, heading, subheading, ctabtn1, ctabtn2, codeblock, codeColor
}) => {
    return (
        <div 
            className={`flex ${position} my-20 justify-between gap-10
            lg:flex-row md:flex-col sm:flex-col items-center`}
        >
            {/* Section 1 */}
            <div className={`w-[50%] lg:w-[50%] md:w-[80%] sm:w-[90%] flex flex-col gap-8`}>
                {heading}
                <div className="text-richblack-300 font-bold text-lg md:text-base sm:text-sm">
                   {subheading}
                </div>

                <div className="flex gap-5 mt-7 sm:flex-col md:flex-row">
                   <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
                       <div className="flex gap-2 items-center">
                           {ctabtn1.btnText}
                           <FaArrowRight />
                       </div>     
                   </CTAButton>

                   <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
                       {ctabtn2.btnText}    
                   </CTAButton>
                </div>
            </div>

            {/* Section 2 */}
            <div className="h-fit flex flex-row w-[100%] py-4 lg:w-[500px] md:w-[80%] sm:w-[90%]">
                {/* Line Numbers */}
                <div className="text-center flex flex-col w-[5%] text-richblack-400 font-inter font-bold">
                    {Array.from({ length: 11 }, (_, i) => (
                        <p key={i}>{i + 1}</p>
                    ))}
                </div>

                {/* Code Block */}
                <div className={`w-[95%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2`} >
                    <TypeAnimation
                        sequence={[codeblock, 2000, ""]}
                        repeat={Infinity}
                        cursor={true}
                        style={{
                            whiteSpace: "pre-line",
                            display: "block"
                        }}
                        omitDeletionAnimation={true}
                    />
                </div>
            </div>
        </div>
    );
}

export default CodeBlock;
