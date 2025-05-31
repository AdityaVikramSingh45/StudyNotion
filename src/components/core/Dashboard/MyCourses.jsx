import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI";
import IconBtn from "../../common/iconBtn";
import { IoIosAdd } from "react-icons/io";
import CoursesTable from "./InstructorCourses/CoursesTable";

const MyCourses = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const result = await fetchInstructorCourses(token);
      if (result) {
        setCourses(result);
      }
    };
    fetchCourses();
  }, [token]);

  return (
    <div className="p-8 bg-richblack-900 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 sm:flex-col md:flex-row">
        <h1 className="text-2xl font-semibold text-richblack-50 mb-4 sm:mb-6 md:mb-0">
          My Courses
        </h1>
        <IconBtn
          text="Add Course"
          onClick={() => navigate("/dashboard/add-course")}
          customClasses="flex items-center gap-x-2 bg-yellow-100 text-richblack-900 px-4 py-2 rounded-md hover:bg-yellow-200 transition-all duration-200 sm:w-full sm:mb-4 md:w-auto"
        >
          <IoIosAdd size={24} />
        </IconBtn>
      </div>

      {/* Courses Table Section */}
      {courses.length > 0 ? (
        <div className="overflow-x-auto">
          <CoursesTable courses={courses} setCourses={setCourses} />
        </div>
      ) : (
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-richblack-100 text-lg">
            No courses found. Start by adding a new course!
          </p>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
