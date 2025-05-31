import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Thead, Tr, Th, Tbody, Td } from "react-super-responsive-table";
import { COURSE_STATUS } from "../../../../utils/constants";
import { IoIosTimer, IoIosCheckmarkCircleOutline } from "react-icons/io";
import ConfirmationModal from "../../../common/ConfirmationModal";
import { MdDelete, MdEdit } from "react-icons/md";
import { deleteCourse, fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { useNavigate } from "react-router-dom";

const CoursesTable = ({ courses, setCourses }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const navigate = useNavigate();

  const handleCourseDelete = async (courseId) => {
    setLoading(true);
    await deleteCourse({ courseId: courseId });
    const result = await fetchInstructorCourses(token);
    if (result) {
      setCourses(result);
    }
    setConfirmationModal(null);
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-8 bg-richblack-900">
      <div className="w-full max-w-6xl bg-richblack-800 text-white rounded-xl shadow-lg p-8 space-y-8">
        <h2 className="text-3xl font-bold text-center text-richblack-50">My Courses</h2>

        <div className="overflow-x-auto">
          <Table className="w-full border border-richblack-700 rounded-lg">
            <Thead>
              <Tr className="bg-richblack-700 text-left text-richblack-50 uppercase text-sm font-semibold">
                <Th className="p-4">Course</Th>
                <Th className="p-4 text-center">Duration</Th>
                <Th className="p-4 text-center">Price</Th>
                <Th className="p-4 text-center">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {courses.length === 0 ? (
                <Tr>
                  <Td colSpan="4" className="p-8 text-center text-richblack-300 text-lg">
                    No Courses Found
                  </Td>
                </Tr>
              ) : (
                courses.map((course) => (
                  <Tr key={course._id} className="border-b border-richblack-700 hover:bg-richblack-700 transition-all duration-200">
                    {/* Course Thumbnail, Title, Status */}
                    <Td className="p-4 flex items-center gap-4">
                      <img src={course.thumbnail} alt="Course Thumbnail" className="h-20 w-32 rounded-lg object-cover shadow-md border border-gray-600" />
                      <div>
                        <p className="font-semibold text-lg">{course.courseName}</p>
                        <p className="text-sm text-richblack-300 mt-1">Created: {course.createdAt}</p>
                        {course.status === COURSE_STATUS.DRAFT ? (
                          <div className="flex items-center gap-2 mt-2 text-pink-500">
                            <IoIosCheckmarkCircleOutline className="text-lg" />
                            <span className="text-sm font-medium">Drafted</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 mt-2 text-yellow-500">
                            <IoIosTimer className="text-lg" />
                            <span className="text-sm font-medium">Published</span>
                          </div>
                        )}
                      </div>
                    </Td>

                    {/* Duration */}
                    <Td className="p-4 text-richblack-200 text-lg text-center">2hr 30min</Td>

                    {/* Price */}
                    <Td className="p-4 text-richblack-200 text-lg text-center">₹{course.price}</Td>

                    {/* Actions */}
                    <Td className="p-4 flex items-center justify-center gap-4">
                      <button
                        disabled={loading}
                        onClick={() => navigate(`/dashboard/edit-course/${course._id}`)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500 text-richblack-900 hover:bg-yellow-400 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <MdEdit className="text-lg" /> Edit
                      </button>

                      <button
                        onClick={() =>
                          setConfirmationModal({
                            text1: "Do you want to delete this course?",
                            text2: "All the data related to this course will be deleted.",
                            btn1Text: "Delete",
                            btn2Text: "Cancel",
                            btn1Handler: !loading ? () => handleCourseDelete(course._id) : () => {},
                            btn2Handler: !loading ? () => setConfirmationModal(null) : () => {},
                          })
                        }
                        disabled={loading}
                        className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <MdDelete className="text-xl text-white" />
                      </button>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </div>

        {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
      </div>
    </div>
  );
};

export default CoursesTable;
