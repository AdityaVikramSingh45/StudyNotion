import React, { useState } from "react";
import { HomePageExplore } from "../../data/homepage-explore";
import HighlightText from "./HighlightText";
import CourseCard from "./CourseCard";

const tabsName = [
    "Free",
    "New to coding",
    "Most popular",
    "Skill paths",
    "Career paths"
];

const ExploreMore = () => {
    const [currentTab, setCurrentTab] = useState(tabsName[0]);
    const [courses, setCourses] = useState(HomePageExplore[0].courses);
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

    const setMyCards = (value) => {
        setCurrentTab(value);
        const result = HomePageExplore.filter((course) => course.tag === value);
        setCourses(result[0].courses);
        setCurrentCard(result[0].courses[0].heading);
    };

    return (
        <div className="lg:mb-[150px] md:mb-[100px] sm:mb-[70px] px-4">

            {/* Heading */}
            <div className="text-4xl md:text-3xl sm:text-2xl font-semibold text-center">
                Unlock the
                <HighlightText text={"Power of code"} />
            </div>

            <p className="text-center text-richblack-300 text-sm md:text-base sm:text-sm mt-3">
                Learn to build anything you can imagine
            </p>

            {/* Tabs */}
            <div className="flex flex-row gap-3 mt-5 mx-auto w-max bg-richblack-800 rounded-full p-1 
                md:w-[90%] sm:w-[100%] md:overflow-x-auto sm:overflow-x-auto scrollbar-hide">
                {
                    tabsName.map((element, idx) => (
                        <div
                            className={`text-[16px] flex items-center gap-2 whitespace-nowrap 
                                ${currentTab === element 
                                    ? "bg-richblue-900 text-richblack-5 font-medium"
                                    : "text-richblack-200"} 
                                rounded-full transition-all duration-200 cursor-pointer 
                                hover:bg-richblue-900 hover:text-richblack-5 px-7 py-2`}
                            key={idx}
                            onClick={() => setMyCards(element)}
                        >
                            {element}
                        </div>
                    ))
                }
            </div>

            {/* Course Cards */}
            <div className="flex gap-10 justify-center flex-wrap mt-10">
                {
                    courses.map((element, idx) => (
                        <CourseCard
                            key={idx}
                            cardData={element}
                            currentCard={currentCard}
                            setCurrentCard={setCurrentCard}
                        />
                    ))
                }
            </div>
        </div>
    );
}

export default ExploreMore;
