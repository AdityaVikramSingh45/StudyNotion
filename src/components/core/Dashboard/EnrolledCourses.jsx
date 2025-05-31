import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI";
import ProgressBar from "@ramonak/react-progress-bar";
import { useNavigate } from "react-router-dom";

const EnrolledCourses = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [enrolledCourses, setEnrolledCourses] = useState(null);

  const getEnrolledCourses = async () => {
    try {
      const response = await getUserEnrolledCourses(token);
      setEnrolledCourses(response || []);
    } catch (err) {
      console.error("Unable to fetch enrolled courses");
    }
  };

  useEffect(() => {
    getEnrolledCourses();
  }, []);

  const generateRandomNumber = ()=>{
    return (Math.floor(Math.random() * 5))
  }

  return (
    <div className="min-h-screen bg-richblack-900 text-richblack-50 px-8 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Enrolled Courses</h1>

      {/* Loading State */}
      {!enrolledCourses ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div>
        </div>
      ) : enrolledCourses.length === 0 ? (
        <p className="text-center text-lg text-richblack-300">
          You have not enrolled in any course yet.
        </p>
      ) : (
        <div className="max-w-5xl mx-auto bg-richblack-800 p-6 rounded-lg shadow-lg">
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-richblack-700 text-richblack-50 font-semibold p-4 rounded-t-lg">
            <p className="col-span-1">Course Name</p>
            <p className="text-center">Duration</p>
            <p className="text-center">Progress</p>
          </div>

          {/* Course List */}
          {enrolledCourses.map((course, index) => (
            <div
              key={index}
              className="grid grid-cols-3 items-center p-4 bg-richblack-900 hover:bg-richblack-700 transition-all rounded-lg my-2 cursor-pointer"
              onClick={() =>
                navigate(
                  `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                )
              }
            >
              {/* Course Info */}
              <div className="flex items-center gap-4 col-span-1">
                <img
                  src={course?.thumbnail}
                  alt={course?.courseName}
                  className="w-20 h-20 rounded-md object-cover"
                />
                <div>
                  <p className="text-lg font-semibold">{course.courseName}</p>
                  <p className="text-sm text-richblack-300">
                    {course.courseDescription.length > 40
                      ? course.courseDescription.slice(0, 40) + "..."
                      : course.courseDescription}
                  </p>
                </div>
              </div>

              {/* Course Duration */}
              <p className="text-center text-richblack-300">
                {generateRandomNumber()} hours
              </p>

              {/* Progress */}
              <div className="text-center">
                <p className="text-sm text-richblack-300">
                  Progress: {course.progressPercentage || 0}%
                </p>
                <ProgressBar
                  completed={course.progressPercentage || 0}
                  height="8px"
                  isLabelVisible={false}
                  bgColor="#FFD700"
                  baseBgColor="#2D2D2D"
                  className="mt-2"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;
