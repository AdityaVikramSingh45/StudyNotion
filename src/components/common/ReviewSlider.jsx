import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Pagination, Autoplay } from 'swiper/modules';
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import ReactStars from "react-stars";
import { apiConnector } from "../../services/apiconnector";
import { ratingsEndpoints } from "../../services/apis";
import { FaStar } from "react-icons/fa";

const ReviewSlider = ()=>{

    const [review, setReview] = useState([]);
    const truncateWords = 15;

    useEffect(()=>{
        const fetchAllReviews = async(req, res)=>{
            const {data} = await apiConnector("GET", ratingsEndpoints.REVIEWS_DETAILS_API)
            // console.log("Logging data in rating", data);

            if(data?.success){
                setReview(data?.data);
            }
            // console.log("Printing Review", review)
        }
        fetchAllReviews()
    }, [])
    

    return(
        <div className="text-white">
           <div className="h-[190px] max-w-maxContent my-swiper">
                <Swiper
                slidesPerView={2}
                spaceBetween={24}
                loop = {true}
                freeMode = {true}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                modules={[FreeMode, Pagination, Autoplay]}
                breakpoints={{
                    1024: {slidesPerView: 3}
                }}
                pagination={true}
                >

                    {
                        review.map((review, index) => (
                            <SwiperSlide key={index}>
                                <div className="flex flex-col gap-3 bg-richblack-800 p-6 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <img 
                                        src = {(review?.user?.image) ? (review?.user?.image)
                                            : `http://api.dicebear.com/9.x/initials/svg?seed=${review?.user?.firstName}${review?.user?.lastName}` }
                                        alt="Profile Pic"
                                        className="h-12 w-12 object-cover rounded-full"
                                        />
                                        <div>
                                            <p className="font-semibold text-richblack-5"> 
                                                {review?.user?.firstName} {review?.user?.lastName} 
                                            </p>
                                            <p className="text-sm text-richblack-300"> 
                                                {review?.course?.courseName} 
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <p className="text-richblack-100 font-medium">
                                        {review?.review.split(" ").splice(0, truncateWords).join(" ") + (review?.review.split(" ").length > 15 ? "....." : "") }
                                    </p>

                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-yellow-100">
                                            {review?.rating.toFixed(1)}
                                        </p>
                                        <ReactStars
                                        count = {5}
                                        value = {review?.rating}
                                        size = {20}
                                        edit = {false}
                                        activeColor = "#ffd700"
                                        emptyIcon = {<FaStar/>}
                                        fullIcon = {<FaStar/>}
                                        />
                                    </div>

                                </div>
                            </SwiperSlide>
                        ))
                    }     

                </Swiper>
           </div>
        </div>
    )
}

export default ReviewSlider