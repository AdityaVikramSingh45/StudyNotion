import React from "react";
import HighlightText from "./HighlightText"; 
import knowYourProgress from "../../assets/Images/Know_your_progress.png"
import compareWithOthers from "../../assets/Images/Compare_with_others.png"
import planYourLesson from "../../assets/Images/Plan_your_lessons.png"
import CTAButton from "./Button";
 
const LearningLanguageSection = ()=>{
    return(
        <div className="flex flex-col items-center gap-5 mt-[130px] w-11/12 mb-[50px]">

            <div className="font-bold text-4xl">
                Your swiss knife for
                <HighlightText text={"learning any language"}/>
            </div>

            <div className=" text-richblack-500 mx-auto text-base w-[70%] text-center">
               Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
            </div>

            <div className="flex flex-row items-center justify-center mt-5 ">
                <img
                    src={knowYourProgress}
                    alt="know your progress"
                    className="object-contain relative left-[120px] w-[36%]"
                />
                 <img 
                    src={compareWithOthers}
                    alt="compareWithOthers"
                    className="object-contain relative left-[85px] w-[36%] "
                />
                 <img
                    src={planYourLesson}
                    alt="planYourLesson"
                    className="object-contain w-[40%] "
                />
            </div>

            <div>
                <CTAButton active={true} linkto={"/signup"}>
                    <div>Learn More</div>
                </CTAButton>
            </div>

        </div>
    );
}

export default LearningLanguageSection;