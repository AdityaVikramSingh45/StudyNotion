import React from "react";
import errorImage from "../assets/Images/error.png";

const Error = () => {
  return (
    <div className="flex items-center justify-center mx-auto my-auto">
      <img
        src={errorImage}
        className="w-[50%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[40%]"
        alt="Error"
      />
    </div>
  );
};

export default Error;
