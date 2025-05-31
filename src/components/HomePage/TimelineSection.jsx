import React from "react";
import Logo1 from "../../assets/TimeLineLogo/Logo1.svg"
import Logo2 from "../../assets/TimeLineLogo/Logo2.svg"
import Logo3 from "../../assets/TimeLineLogo/Logo3.svg"
import Logo4 from "../../assets/TimeLineLogo/Logo4.svg"
import timelineImage from "../../assets/Images/TimelineImage.png"


const timeline = [
    {
        Logo: Logo1,
        Heading: "Leadership",
        Description: "Fully committed to the success company"
    },
    {
        Logo: Logo2,
        Heading: "Responsibility",
        Description: "Students will always be our top priority"
    },
    {
        Logo: Logo3,
        Heading: "Flexibility",
        Description: "The ability to switch is an important skills"
    },{
        Logo: Logo4,
        Heading: "Solve the problem",
        Description: "Code your way to a solution"
    }
]



const TimelineSection = ()=>{
    return (
        <div className="w-11/12 ml-[30px] mt-[25px]">

            <div className="flex flex-row gap-15 items-center">

                <div className="w-[45%] flex flex-col gap-5 ">
                    {
                        timeline.map( (ele, idx)=>{
                            return(
                                <div className="flex flex-row gap-6" key={idx}>

                                    <div className="w-[50px] h-[50px] bg-white flex items-center justify-center">
                                        <img src={ele.Logo}/>
                                    </div>

                                    <div className="">
                                        <h2 className="font-semibold text-[18px]">{ele.Heading}</h2>
                                        <p className="text-base">{ele.Description}</p>
                                    </div>

                                </div>
                            );
                        })
                    }
                </div>

                <div className="relative shadow-blue-200">

                    <img src={timelineImage} alt="timelineImage" className="shadow-white object-cover h-fit "/>

                    <div className="absolute bg-caribbeangreen-700 flex text-white uppercase py-8 left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-lg h-[80px] ">

                        <div className="flex gap-5 items-center border-r border-caribbeangreen-50 px-7">
                            <p className="text-3xl font-bold">10</p>
                            <p className="text-caribbeangreen-50 text-sm">YEARS EXPERIENCES</p>
                        </div>

                        <div className="flex gap-5 items-center px-7">
                           <p className="text-3xl font-bold">250</p>
                           <p className="text-caribbeangreen-50 text-sm">TYPES OF COURSES</p>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default TimelineSection;