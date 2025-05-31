import React from "react";

const HighlightText = ({text})=>{
    return (
        <span className="font-bold text-richblue-50">
            {" "}
            {text}
        </span>
    );
}

export default HighlightText;