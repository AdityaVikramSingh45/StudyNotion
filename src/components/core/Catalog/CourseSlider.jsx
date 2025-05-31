import React from "react";
// import Swiper from "swiper";
// import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Pagination,Autoplay } from 'swiper/modules';
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"


import Course_Card from "./Course_Card";

const CourseSlider = ({courses})=>{

    return(
        <>
           {
            courses?.length ? (
                <Swiper
                effect="coverflow"
                // slidesPerView={3}
                spaceBetween={25}
                loop={true}
                freeMode={true}
                autoplay={{
                    delay: 3000, // Set autoplay delay to 2.5 seconds
                    disableOnInteraction: false, // Allows autoplay to continue after user interaction
                }}
                modules={[FreeMode, Pagination, Autoplay]}
                breakpoints={{
                    1024: {slidesPerView: 2}
                }}
                pagination={true}
                className="max-h-[30rem] my-swiper"
                >
                    {
                        courses?.map((course)=>(
                            <SwiperSlide key={course._id}>
                                <Course_Card course={course} Height={`h-[250px]`} />
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            )  : ( <p>No courses Found</p> )
           }
        </>
    )
}

export default CourseSlider