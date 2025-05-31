import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import IconBtn from "../../common/iconBtn";

const VideoDetailsSidebar = ({ setReviewModal }) => {
  const [activeStatus, setActiveStatus] = useState("");
  const [videoBarActive, setVideoBarActive] = useState("");
  const dispatch = useDispatch();
  const { sectionId, subSectionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse);

  useEffect(() => {
    if (!courseSectionData.length) return;

    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const activeSubSectionId =
      courseSectionData[currentSectionIndex]?.subSection?.find(
        (data) => data._id === subSectionId
      )?._id;

    setActiveStatus(courseSectionData?.[currentSectionIndex]?._id);
    setVideoBarActive(activeSubSectionId);
  }, [courseSectionData, location.pathname, courseEntireData]);

  return (
    <div className="w-80 min-h-screen bg-richblack-800 text-white p-6 shadow-lg rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          className="flex items-center text-gray-300 hover:text-white transition"
          onClick={() => navigate("/dashboard/enrolled-courses")}
        >
          <IoMdArrowRoundBack className="mr-2 text-lg" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <IconBtn text="Add Review" onClick={() => setReviewModal(true)} />
      </div>

      {/* Course Info */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">{courseEntireData?.courseName}</h2>
        <p className="text-sm text-gray-400">
          {completedLectures.length} / {totalNoOfLectures} Lectures Completed
        </p>
        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{
              width: `${(completedLectures.length / totalNoOfLectures) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Sections and Subsections */}
      <div className="space-y-4">
        {courseSectionData.map((section, index) => (
          <div key={index} className="bg-richblack-700 p-3 rounded-lg">
            {/* Section Header */}
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() =>
                setActiveStatus(activeStatus === section._id ? "" : section._id)
              }
            >
              <h3 className="text-sm font-medium">{section?.sectionName}</h3>
              {activeStatus === section._id ? (
                <FiChevronUp className="text-lg" />
              ) : (
                <FiChevronDown className="text-lg" />
              )}
            </div>

            {/* Subsections */}
            {activeStatus === section._id && (
              <div className="mt-3 space-y-2">
                {section.subSection.map((topic, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-md text-sm cursor-pointer transition ${
                      videoBarActive === topic._id
                        ? "bg-yellow-300 text-richblack-900 font-semibold"
                        : "bg-richblack-600 text-white hover:bg-richblack-500"
                    }`}
                    onClick={() => {
                      navigate(
                        `/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${topic?._id}`
                      );
                      setVideoBarActive(topic?._id);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={completedLectures.includes(topic?._id)}
                      onChange={() => {}}
                      className="accent-green-500"
                    />
                    <span>{topic.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoDetailsSidebar;
