import ReactStars from 'react-stars'
import React, { useEffect } from 'react'
import { render } from 'react-dom'
import { useDispatch, useSelector } from "react-redux"
import { GiNinjaStar } from "react-icons/gi";
import { MdDeleteOutline } from "react-icons/md";
import { removeFromCart } from '../../../../slices/cartSlice';



const RenderCartCourses = ()=>{
    
    const {cart} = useSelector((state)=>state.cart)
    const dispatch = useDispatch();

    
    
    return(
        <div>
            {
                cart.map((course, index)=>{
                    return(
                        <div>
                            <img src={course?.thumbnail} />
                            <div className='text-white'>
                                <p>{course?.courseName}</p>
                                 {/* <p>{course?.category}</p> */}
                                 {course?.category?.name}
                                <div>
                                    <span>4.8</span>
                                    <ReactStars
                                    count = {5}
                                    size={20}
                                    edit={false}
                                    activecolor = "#ffd700"
                                    emptyIcon={<GiNinjaStar />}
                                    fullIcon={<GiNinjaStar />}
                                    />
                                    <span>{course?.ratingAndReviews?.length || 0} Ratings</span>
                                </div>
                            </div>

                            <div>
                                <button
                                onClick={() => dispatch(removeFromCart(course?._id))}
                                >
                                    <MdDeleteOutline />
                                    <span>Remove</span>
                                </button>
                                <p>
                                    {course?.price}
                                </p>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default RenderCartCourses