import React from "react";
import HighlightText from "../../../HomePage/HighlightText";
import CTAButton from "../../../HomePage/Button";

const LearningGridArray = [
    {
        order: -1,
        heading: "World-Class Learning for",
        highlightText: "Anyone, Anywhere",
        description:
            "Studynotion partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.",
        BtnText: "Learn More",
        BtnLink: "/signup",
    },
    {
        order: 1,
        heading: "Curriculum Based on Industry Needs",
        description:
            "Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs.",
    },
    {
        order: 2,
        heading: "Our Learning Methods",
        description:
            "Studynotion partners with more than 275+ leading universities and companies to bring",
    },
    {
        order: 3,
        heading: "Certification",
        description:
            "Studynotion partners with more than 275+ leading universities and companies to bring",
    },
    {
        order: 4,
        heading: `Rating "Auto-grading"`,
        description:
            "Studynotion partners with more than 275+ leading universities and companies to bring",
    },
    {
        order: 5,
        heading: "Ready to Work",
        description:
            "Studynotion partners with more than 275+ leading universities and companies to bring",
    },
];

const LearningGrid = () => {
    return (
        <div className="grid mx-auto w-full max-w-[1200px] gap-6 mb-12
            grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            
            {LearningGridArray.map((card, idx) => (
                <div
                    key={idx}
                    className={`
                        ${idx === 0 && "lg:col-span-2 lg:h-[280px] p-5"} 
                        ${card.order % 2 === 1 ? "bg-richblack-700" : "bg-richblack-800"} 
                        ${card.order === 3 && "lg:col-start-2"} 
                        ${card.order < 0 ? "bg-transparent" : "p-5"} 
                        rounded-lg shadow-md transition-transform hover:scale-105
                    `}
                >
                    {card.order < 0 ? (
                        <div className="flex flex-col gap-4 lg:w-[90%] pb-5">
                            <div className="text-4xl font-semibold">
                                {card.heading}
                                <HighlightText text={card.highlightText} />
                            </div>
                            <p className="font-medium">
                                {card.description}
                            </p>
                            <div className="w-fit mt-4">
                                <CTAButton active={true} linkto={card.BtnLink}>
                                    {card.BtnText}
                                </CTAButton>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 justify-center h-full">
                            <h1 className="text-richblack-5 text-lg">{card.heading}</h1>
                            <p className="text-richblack-300 font-medium">
                                {card.description}
                            </p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default LearningGrid;
