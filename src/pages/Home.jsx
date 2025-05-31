import React, { act } from "react";
import { Link } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import HighlightText from "../components/HomePage/HighlightText";
import CTAButton from "../components/HomePage/Button";
import Banner from "../assets/Images/banner.mp4"; 
import CodeBlock from "../components/HomePage/CodeBlock";
import LearningLanguageSection from "../components/HomePage/LearningLanguageSection";
import TimelineSection from "../components/HomePage/TimelineSection";
import InstructorSection from "../components/HomePage/InstructorSection"; 
import Footer from "../components/common/Footer";
import ExploreMore from "../components/HomePage/ExploreMore";
import ReviewSlider from "../components/common/ReviewSlider"; 
                                                                                

const Home = () => {
    return (
        <div>
            {/* Section 1 */}
            <div className="relative mx-auto flex flex-col w-11/12 items-center text-white justify-between max-w-maxContent">
                <Link to="/signup">
                    <div className="group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit">
                        <div className="group-hover:bg-richblue-900 flex flex-row  items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200">
                            <p>Become an Instructor</p>
                            <FaArrowRightLong />
                        </div>
                    </div>
                </Link>
                

                <div className="font-semibold text-center text-4xl mt-5">
                   Empower Your Future with 
                   <HighlightText text = {"Coding Skills"}/>
                </div>

                <div className="w-[90%] text-center text-lg font-bold text-richblack-300 mt-4">
                   With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of including hands-on projects, quizzes, and personalized feedback from instructors.
                </div>

                <div className="flex flex-row gap-7 mt-9">
                    <CTAButton active={true} linkto={"/signup"}>
                        Learn More
                    </CTAButton>

                    <CTAButton active={false} linkto={"/login"}>
                        Book a Demo
                    </CTAButton>
                </div>

                {/* Video section */}
                <div className= "shadow-lg shadow-blue-200 mx-3 my-12 rounded-lg">
                    <video muted loop autoPlay>
                        <source src={Banner} type="video/mp4"/>
                    </video>
                </div>

                {/* Code section 1 */}
                <div>
                    <CodeBlock 
                       position={"lg:flex-row"}

                       heading={
                        <div className="text-4xl font-semibold">
                            Unlock your
                            <HighlightText text={"coding potential "}/>
                            with our online courses.
                        </div>
                       }

                       subheading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."}

                       ctabtn1={
                        {
                            btnText : "Try it Yourself",
                            linkto: "/signup",
                            active: true
                        }
                       }

                       ctabtn2 = {
                        {
                            btnText: "Learn More",
                            active: false,
                            linkto: "login"
                        }
                       }

                       codeblock={`<!DOCTYPE html>\n<html>\nhead><>Example</\ntitle><linkrel="stylesheet"href="styles.css">\n/head>\nbody>\nh1><ahref="/">Header</a>\n/h1>\nnav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>\n/nav>\n`}

                       codeColor={"text-yellow-25"}
                    />
                </div>

                {/* Code section 2 */}
                <div>
                    <CodeBlock 
                       position={"lg:flex-row-reverse"}

                       heading={
                        <div className="text-4xl font-semibold">
                            Start
                            <HighlightText text={`coding in seconds`}/>
                        </div>
                       }

                       subheading={"Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."}

                       ctabtn1={
                        {
                            btnText : "Continue Learning",
                            linkto: "/signup",
                            active: true
                        }
                       }

                       ctabtn2 = {
                        {
                            btnText: "Learn More",
                            active: false,
                            linkto: "login"
                        }
                       }

                       codeblock={`<!DOCTYPE html>\n<html>\nhead><>Example</\ntitle><linkrel="stylesheet"href="styles.css">\n/head>\nbody>\nh1><ahref="/">Header</a>\n/h1>\nnav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>\n/nav>\n`}

                       codeColor={"text-blue-100"}
                    />
                </div>

                <ExploreMore/>
            </div>

            {/* Section 2 */}
            <div className="bg-pure-greys-5 text-richblack-700 ">

                <div className="homepage_bg w-[800px] h-[250px] mx-auto">
                    <div className="w-11/12 max-w-maxContent flex flex-col items-center gap-5 mx-auto">
                        <div className="flex flex-row gap-7 text-white mt-[120px]">
                            <CTAButton active = {true} linkto={"/signup"}>
                                <div className="flex items-center gap-1.5">
                                    Explore Full Catalog
                                    <FaArrowRightLong/>
                                </div>
                            </CTAButton>
                            <CTAButton active = {false} linkto={"/login"}>
                                <div className="flex items-center gap-1.5">
                                    Learn More
                                </div>
                            </CTAButton>
                        </div>
                    </div>
                </div>

                <div className="w-11/12 mx-auto max-w-maxContent flex flex-col item-center justify-between gap-7 mt-[100px]">

                   <div className="flex gap-5 ml-[75px]">
                       
                       <div className="text-4xl font-semibold w-[45%]">
                            Get the skills you need for a
                            <HighlightText text={"job that is in demand"}/>
                       </div>

                       <div className="flex flex-col gap-10 w-[40%] items-start  ">
                            <div className="text-[15px] ">
                               The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                            </div>
                            <div className="w-[25%]">
                                <CTAButton active={true} linkto={"/signup"}>
                                    <div>Learn More</div>
                                </CTAButton>
                            </div>
                       </div>

                   </div>

                   <TimelineSection/>

                   <LearningLanguageSection/>

                </div>

            </div>

            {/* Section 3 */}

            <div className="w-11/12 mx-auto max-w-maxContent flex flex-col justify-between gap-8 bg-richblack-900 textt-white">

                <InstructorSection/>

                <h3 className="text-center text-4xl font-semibold mt-10 text-white">Reviews from other learner</h3>

                {/* <ReviewSlider/> */}
                <ReviewSlider/>

            </div>

            {/* Footer*/}
            <Footer/>

        </div>
    );
}

export default Home;