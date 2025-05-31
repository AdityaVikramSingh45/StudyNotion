import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import IconBtn from "../../../../common/iconBtn";
import { resetCourseState, setStep } from "../../../../../slices/courseSlice";
import { COURSE_STATUS } from "../../../../../utils/constants";
import { editCourseDetails } from "../../../../../services/operations/courseDetailsAPI";
import { useNavigate } from "react-router-dom";

const PublishCourse = () => {
  const { register, setValue, getValues, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (course.status === COURSE_STATUS.PUBLISHED) {
      setValue("public", true);
    }
  }, [course.status, setValue]);

  const goToCourses = () => {
    dispatch(resetCourseState());
    navigate("/dashboard/my-courses");
  };

  const handleCoursePublish = async () => {
    if (
      (course?.status === COURSE_STATUS.PUBLISHED && getValues("public") === true) ||
      (course?.status === COURSE_STATUS.DRAFT && getValues("public") === false)
    ) {
      goToCourses();
      return;
    }

    const formData = new FormData();
    formData.append("courseId", course._id);
    const courseStatus = getValues("public") ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT;
    formData.append("status", courseStatus);

    setLoading(true);

    const result = await editCourseDetails(formData, token);
    if (result) {
      goToCourses();
    }

    setLoading(false);
  };

  const onSubmit = () => {
    handleCoursePublish();
  };

  const goBack = () => {
    dispatch(setStep(2));
  };

  return (
    <div className="rounded-lg border border-richblack-700 bg-richblack-800 p-6 text-white max-w-lg mx-auto shadow-lg">
      <h2 className="text-xl font-semibold text-yellow-50 mb-4">Publish Course</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="public"
            {...register("public", { required: true })}
            className="h-5 w-5 accent-yellow-50 cursor-pointer"
          />
          <label htmlFor="public" className="text-richblack-100 cursor-pointer">
            Make this Course Public
          </label>
        </div>

        <div className="flex justify-end gap-4">
          <button
            disabled={loading}
            type="button"
            onClick={goBack}
            className="px-6 py-3 rounded-lg bg-richblack-700 text-richblack-50 hover:bg-richblack-600 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <IconBtn
            disabled={loading}
            text="Save Changes"
            customClasses="bg-yellow-50 text-richblack-900 hover:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </form>
    </div>
  );
};

export default PublishCourse;
