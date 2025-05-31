import React from "react";
import Instructor from "../../assets/Images/Instructor.png";
import HighlightText from "./HighlightText";
import CTAButton from "./Button";
import { FaArrowRightLong } from "react-icons/fa6";

const InstructorSection = () => {
    return (
        <div className="flex flex-col lg:flex-row gap-10 items-center mt-16 w-11/12 mx-auto justify-center">

            {/* Instructor Image */}
            <div className="lg:w-[50%] md:w-[70%] sm:w-[90%] flex justify-center">
                <img
                    src={Instructor}
                    alt="Instructor"
                    className="w-full max-w-[500px] rounded-lg shadow-lg"
                />
            </div>

            {/* Text and CTA Section */}
            <div className="lg:w-[50%] md:w-[70%] sm:w-[90%] flex flex-col items-center text-center">

                <div className="text-4xl md:text-3xl sm:text-2xl text-white font-semibold">
                    Become an
                    <HighlightText text={"Instructor"} />
                </div>

                <div className="text-sm md:text-base sm:text-sm text-richblack-100 mt-4 w-[90%] mx-auto">
                    Instructors from around the world teach millions of students on StudyNotion. 
                    We provide the tools and skills to teach what you love.
                </div>

                <div className="mt-6">
                    <CTAButton active={true} linkto={"/signup"}>
                        <div className="flex items-center gap-2 font-bold">
                            Start Teaching Today
                            <FaArrowRightLong />
                        </div>
                    </CTAButton>
                </div>

            </div>

        </div>
    );
}

export default InstructorSection;
