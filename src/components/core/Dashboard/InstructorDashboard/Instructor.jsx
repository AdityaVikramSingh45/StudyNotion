import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";
import { getInstructorData } from "../../../../services/operations/profileAPI";
import { Link } from "react-router-dom";
import InstructorChart from "./InstructorChart";

const Instructor = () => {
  const [loading, setLoading] = useState(false);
  const [instructorData, setInstructorData] = useState(null);
  const [courses, setCourses] = useState(null);

  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  useEffect(() => {
    const getCourseDataWithStats = async () => {
      setLoading(true);
      const instructorApiData = await getInstructorData(token);
      const result = await fetchInstructorCourses(token);
      console.log("result", result);
      console.log("instructorApiData--->>", instructorApiData);

      if (instructorApiData.length) {
        setInstructorData(instructorApiData);
      }
      if (result) {
        setCourses(result);
      }
      console.log("Courses", courses);

      setLoading(false);
    };
    getCourseDataWithStats();
  }, []);

  const totalAmount = instructorData?.reduce((acc, curr) => acc + curr.totalAmountGenerated, 0);
  const totalStudents = instructorData?.reduce((acc, curr) => acc + curr.totalStudentsEnrolled, 0);

  return (
    <div className="text-white p-8 bg-richblack-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-richblack-50">Hi, {user?.firstName}!</h1>
          <p className="text-richblack-200">Let's start something new</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="spinner text-richblack-50">Loading...</div>
          </div>
        ) : courses?.length > 0 ? (
          <div className="space-y-10">
            {/* Statistics and Chart Section */}
            <div className="bg-richblack-800 rounded-xl p-6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Chart */}
                <div>
                  <InstructorChart courses={instructorData} />
                </div>

                {/* Statistics */}
                <div className="space-y-6">
                  <p className="text-xl font-semibold text-richblack-50">Statistics</p>
                  <div className="space-y-4">
                    <div className="bg-richblack-700 p-4 rounded-lg">
                      <p className="text-richblack-200">Total Courses</p>
                      <p className="text-2xl font-bold text-yellow-500">{courses?.length}</p>
                    </div>
                    <div className="bg-richblack-700 p-4 rounded-lg">
                      <p className="text-richblack-200">Total Students</p>
                      <p className="text-2xl font-bold text-yellow-500">{totalStudents}</p>
                    </div>
                    <div className="bg-richblack-700 p-4 rounded-lg">
                      <p className="text-richblack-200">Total Income</p>
                      <p className="text-2xl font-bold text-yellow-500">₹{totalAmount}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Courses Section */}
            <div className="bg-richblack-800 rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <p className="text-xl font-semibold text-richblack-50">Your Courses</p>
                <Link to="/dashboard/my-courses" className="text-yellow-500 hover:text-yellow-400 transition-all">
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {courses.slice(0, 3).map((course) => (
                  <div key={course._id} className="bg-richblack-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
                    <img
                      src={course?.thumbnail}
                      alt="Course Thumbnail"
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <p className="text-lg font-semibold text-richblack-50">{course?.courseName}</p>
                      <div className="flex items-center gap-2 text-richblack-200 mt-2">
                        <p>{course?.studentsEnrolled?.length} Students</p>
                        <p>|</p>
                        <p>₹{course?.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-richblack-800 rounded-xl p-6 shadow-lg">
            <p className="text-xl text-richblack-200 mb-4">You have not created any courses yet</p>
            <Link
              to="/dashboard/add-course"
              className="px-6 py-2 bg-yellow-500 text-richblack-900 rounded-lg hover:bg-yellow-400 transition-all"
            >
              Create a Course
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Instructor;