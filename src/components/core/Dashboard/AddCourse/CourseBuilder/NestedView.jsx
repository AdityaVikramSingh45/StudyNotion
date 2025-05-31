import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxDropdownMenu } from "react-icons/rx";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoIosArrowDropdown } from "react-icons/io";
import { CiCirclePlus } from "react-icons/ci";
import SubSectionModal from "./SubSectionModal";
import { deleteSection, deleteSubSection } from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import ConfimationModal from "../../../../common/ConfirmationModal";

const NestedView = ({ handleChangeEditSectionName }) => {
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [addSubSection, setAddSubSection] = useState(null);
  const [editSubSection, setEditSubSection] = useState(null);
  const [viewSubSection, setViewSubSection] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);

  const handleDeleteSection = async (sectionId) => {
    const result = await deleteSection({ sectionId, courseId: course._id }, token);
    if (result) dispatch(setCourse(result));
    setConfirmationModal(null);
  };

  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    const result = await deleteSubSection({ subSectionId, sectionId, token });
    if (result) {
      const updateCourseContent = course.courseContent.map((section) =>
        section._id === sectionId ? result : section
      );
      dispatch(setCourse({ ...course, courseContent: updateCourseContent }));
    }
    setConfirmationModal(null);
  };

  return (
    <div className="mt-3 max-w-4xl mx-auto p-4 bg-richblack-900 rounded-lg shadow-md">
      <div>
        {course?.courseContent.map((section) => (
          <details key={section._id} className="mb-4 border border-richblack-700 rounded-lg overflow-hidden">
            <summary className="flex items-center justify-between p-3 bg-richblack-800 text-white cursor-pointer hover:bg-richblack-700 transition-all">
              <div className="flex items-center gap-x-3">
                <RxDropdownMenu className="text-lg" />
                <p className="w-[60%] truncate">{section.sectionName}</p>
              </div>
              <div className="flex gap-x-2">
                <button
                  onClick={() => handleChangeEditSectionName(section._id, section.sectionName)}
                  className="p-1 rounded-md hover:bg-richblack-600 transition-all"
                >
                  <MdOutlineEdit className="text-xl text-yellow-400" />
                </button>
                <button
                  onClick={() =>
                    setConfirmationModal({
                      text1: "Delete this Section",
                      text2: "All lectures in this section will be deleted",
                      btn1Text: "Delete",
                      btn2Text: "Cancel",
                      btn1Handler: () => handleDeleteSection(section._id),
                      btn2Handler: () => setConfirmationModal(null),
                    })
                  }
                  className="p-1 rounded-md hover:bg-red-600 transition-all"
                >
                  <RiDeleteBin6Line className="text-xl text-red-400" />
                </button>
                <IoIosArrowDropdown className="text-2xl text-richblack-300" />
              </div>
            </summary>

            <div className="p-3 bg-richblack-800">
              {section?.subSection.map((data) => (
                <div
                  key={data?._id}
                  onClick={() => setViewSubSection(data)}
                  className="flex items-center justify-between p-2 border-b border-richblack-700 hover:bg-richblack-700 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-x-3">
                    <RxDropdownMenu className="text-lg text-gray-400" />
                    <p className="w-[60%] truncate text-white">{data?.title}</p>
                  </div>

                  <div onClick={(e) => e.stopPropagation()} className="flex gap-x-2">
                    <button
                      onClick={() => setEditSubSection({ ...data, sectionId: section._id })}
                      className="p-1 rounded-md hover:bg-yellow-600 transition-all"
                    >
                      <MdOutlineEdit className="text-lg text-yellow-400" />
                    </button>
                    <button
                      onClick={() =>
                        setConfirmationModal({
                          text1: "Delete this Sub Section",
                          text2: "Selected lecture will be deleted",
                          btn1Text: "Delete",
                          btn2Text: "Cancel",
                          btn1Handler: () => handleDeleteSubSection(data._id, section._id),
                          btn2Handler: () => setConfirmationModal(null),
                        })
                      }
                      className="p-1 rounded-md hover:bg-red-600 transition-all"
                    >
                      <RiDeleteBin6Line className="text-lg text-red-400" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => setAddSubSection(section._id)}
                className="flex items-center mt-4 gap-x-2 text-yellow-400 hover:text-yellow-300 transition-all"
              >
                <CiCirclePlus className="text-xl" />
                <p className="text-sm font-medium">Add Lecture</p>
              </button>
            </div>
          </details>
        ))}
      </div>

      {addSubSection && <SubSectionModal modalData={addSubSection} setModalData={setAddSubSection} add={true} />}
      {viewSubSection && <SubSectionModal modalData={viewSubSection} setModalData={setViewSubSection} view={true} />}
      {editSubSection && <SubSectionModal modalData={editSubSection} setModalData={setEditSubSection} edit={true} />}

      {confirmationModal && <ConfimationModal modalData={confirmationModal} />}
    </div>
  );
};

export default NestedView;
