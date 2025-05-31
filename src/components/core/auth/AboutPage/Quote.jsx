import React from "react";
import HighlightText from "../../../HomePage/HighlightText";

const Quote = () => {
    return (
        <div className="text-center md:text-left px-4 sm:px-6 md:px-0">
            <p className="text-base md:text-lg leading-relaxed md:leading-loose">
                We are passionate about revolutionizing the way we learn. Our innovative platform
                <HighlightText text={"combines technology,"}/>
                <span className="text-pink-100">
                    {" "}
                    expertise
                </span>
                and community to create an
                <span className="text-pink-100">
                    {" "}
                    unparalleled educational experience.
                </span>
            </p>
        </div>
    );
}

export default Quote;
