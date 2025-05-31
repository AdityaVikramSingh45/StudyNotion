import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { GiCancel } from "react-icons/gi";
import { useSelector } from "react-redux";
import ReactStars from "react-rating-stars-component";
import IconBtn from "../../common/iconBtn";
import { createRating } from "../../../services/operations/courseDetailsAPI";

const CourseReviewModal = ({ setReviewModal }) => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { courseEntireData } = useSelector((state) => state.viewCourse);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue("courseExperience", "");
    setValue("courseRating", "");
  }, []);

  const onSubmit = async (data) => {
    await createRating(
      {
        courseId: courseEntireData?._id,
        rating: data.courseRating,
        review: data.courseExperience,
      },
      token
    );
    setReviewModal(false);
  };

  const ratingChange = (newRating) => {
    setValue("courseRating", newRating);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-richblack-900 p-6 text-white shadow-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-richblack-700 pb-3">
          <p className="text-xl font-semibold">Add Review</p>
          <button
            onClick={() => setReviewModal(false)}
            className="text-richblack-300 hover:text-pink-500 transition"
          >
            <GiCancel size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex items-center gap-4 py-4">
          <img
            src={user?.image}
            alt="User"
            className="h-12 w-12 rounded-full object-cover border-2 border-richblack-600"
          />
          <div>
            <p className="text-lg font-medium">{user?.firstName} {user?.lastName}</p>
            <p className="text-sm text-richblack-300">Posting Publicly</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Star Rating */}
          <div className="flex justify-center">
            <ReactStars
              count={5}
              onChange={ratingChange}
              size={30}
              activeColor="#ffd700"
            />
          </div>

          {/* Review Text Area */}
          <div>
            <label htmlFor="courseExperience" className="block text-richblack-300 text-sm">
              Add Your Experience
            </label>
            <textarea
              id="courseExperience"
              placeholder="Share your thoughts..."
              {...register("courseExperience", { required: true })}
              className="w-full mt-1 rounded-lg border border-richblack-600 bg-richblack-800 p-3 text-white outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
              rows="4"
            />
            {errors.courseExperience && (
              <span className="text-pink-500 text-sm">Please add your experience</span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setReviewModal(false)}
              className="rounded-lg bg-richblack-700 px-4 py-2 text-sm text-white hover:bg-richblack-600 transition"
            >
              Cancel
            </button>
            <IconBtn text="Save" type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseReviewModal;
