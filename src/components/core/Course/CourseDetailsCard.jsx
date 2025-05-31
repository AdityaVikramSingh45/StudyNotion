import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaRegShareFromSquare } from "react-icons/fa6";
import { FaGooglePlay } from "react-icons/fa";
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import { addToCart } from "../../../slices/cartSlice";
import ConfirmationModal from "../../common/ConfirmationModal";

const CourseDetailsCard = ({ course, setConfirmationModal, handleBuyCourse }) => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(()=>{
    if(!token){
      toast.error("Login first to buy courses");
    }
  }, [])

  const { thumbnail: ThumbnailImage, price: CurrentPrice } = course;


  const handleAddToCart = () => {
    if (token) {
      dispatch(addToCart(course));
      return;
    }
    
    if (user && ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an instructor, you can't buy a course");
      return;
    }
    setConfirmationModal({
      text1: "You are not logged in",
      text2: "Please Login to add to cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  const handleShare = () => {
    copy(window.location.href);
    toast.success("Link Copied to Clipboard");
  };

  return (
    <div className="w-full max-w-md bg-white bg-opacity-30 backdrop-blur-lg p-6 rounded-2xl shadow-2xl text-white">
      {/* Course Thumbnail */}
      <img
        src={ThumbnailImage}
        alt="Course Thumbnail"
        className="w-full h-[250px] object-cover rounded-xl shadow-lg"
      />

      {/* Price Section */}
      <div className="text-3xl font-bold text-yellow-400 mt-4 text-center">
        ₹ {CurrentPrice}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-y-4 mt-6">
        <button
          className="w-full bg-yellow-500 text-black font-semibold py-3 rounded-xl hover:bg-yellow-600 transition-all duration-300"
          onClick={
            user && course?.studentsEnrolled.includes(user?._id)
              ? () => navigate("/dashboard/enrolled-courses")
              : () => handleBuyCourse()
          }
        >
          {user && course.studentsEnrolled.includes(user?._id) ? "Go to Course" : "Buy Now"}
        </button>

        {
          user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <div>
              {!course?.studentsEnrolled.includes(user?._id) && (
          <button
            className="w-full bg-transparent border border-pink-500 text-pink-400 font-semibold py-3 rounded-xl hover:bg-pink-600 hover:text-white transition-all duration-300"
            onClick={handleAddToCart}
          >
            
            Add to Cart
          </button>
        )}
            </div>
          )
        }

        
      </div>

      {/* Course Benefits */}
      <div className="mt-6">
        <p className="text-gray-200 text-lg font-medium">✅ 30-Day Money-Back Guarantee</p>
        <p className="text-gray-300 text-lg font-medium mt-3">📚 This Course Includes:</p>
        <div className="flex flex-col gap-y-2 mt-3">
          {course.instructions?.map((item, index) => (
            <p key={index} className="text-white flex gap-x-2">
              <FaGooglePlay className="text-green-400 text-lg" />
              <span>{item}</span>
            </p>
          ))}
        </div>
      </div>

      {/* Share Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleShare}
          className="flex items-center gap-x-2 bg-gray-800 text-gray-300 px-4 py-2 rounded-xl hover:bg-gray-700 transition-all duration-300"
        >
          <FaRegShareFromSquare className="text-xl" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default CourseDetailsCard;
