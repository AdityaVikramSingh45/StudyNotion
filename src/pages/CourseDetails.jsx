import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { buyCourse } from "../services/operations/studentFeaturesAPI";
import toast from "react-hot-toast";
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import GetAvgRating from "../utils/avgRating";
import Error from "../../src/pages/Error";
import ConfirmationModal from "../components/common/ConfirmationModal";
import RatingStars from "../components/common/RatingStars";
import { formatDate } from "../services/operations/formatDate";
import { GrLanguage } from "react-icons/gr";
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard";
import CourseAccordionBar from "../components/core/Course/CourseAccordionBar";
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI";

const CourseDetails = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { courseId } = useParams();
  const { loading } = useSelector((state) => state.profile);
  const { paymentLoading } = useSelector((state) => state.course);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [courseData, setCourseData] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [avgReviewCount, setAvgReviewCount] = useState(0);
  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
  const [isActive, setIsActive] = useState([]);
  const [sectionData, setSectionData] = useState([]);

  useEffect(() => {
    const getCourseFullDetails = async () => {
      try {
        const result = await fetchCourseDetails(courseId);
        const result2 = await getFullDetailsOfCourse(courseId, token);
        // console.log("Result2--->>>>>",result2)
        // console.log("Result2.courseDetails--->>>>>",result2.courseDetails?.courseContent)
        // console.log("Result.courseDetails.courseContent--->>>>>",result?.data.courseDetails.courseContent)
        console.log("Result--->>>>>",result)
        setSectionData(result2.courseDetails?.courseContent);
        setCourseData(result);
      } catch (error) {
        console.log("Could not fetch course details");
      }
    };
    getCourseFullDetails();
  }, [courseId]);



  useEffect(() => {
    const count = GetAvgRating(courseData?.data?.courseDetails?.ratingAndReviews);
    setAvgReviewCount(count);
  }, [courseData]);

  useEffect(() => {
    let lectures = 0;
    courseData?.data?.courseDetails?.courseContent?.forEach((sec) => {
      lectures += sec.subSection.length || 0;
    });
    setTotalNoOfLectures(lectures);
  }, [courseData]);

  const handleActive = (id) => {
    setIsActive((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const handleBuyCourse = () => {
    if (token) {
      buyCourse(token, courseId, user, navigate, dispatch);
      return;
    }
    setConfirmationModal({
      text1: "You are not logged in",
      text2: "Please login to purchase the course",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  if (loading || !courseData) {
    return <div className="text-center text-lg text-gray-300 py-10">Loading...</div>;
  }

  if (!courseData.success) {
    return <Error />;
  }

  const {
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentsEnrolled,
    createdAt,
  } = courseData?.data?.courseDetails;

  return (
    <div className="flex flex-col md:flex-row items-start text-white px-6 md:px-16 py-12 space-y-10 md:space-y-0 bg-gradient-to-b from-gray-900 to-black min-h-screen">
      {/* Left Section - Course Overview & Content */}
      <div className="flex-1 space-y-10">
        {/* Course Overview */}
        <div className="bg-opacity-30 bg-white backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
          <h1 className="text-4xl font-extrabold text-white">{courseName}</h1>
          <p className="text-gray-300 text-lg mt-4">{courseDescription}</p>

          <div className="flex items-center gap-x-3 text-gray-200 text-sm mt-4">
            <span className="text-yellow-400 font-semibold text-lg">{avgReviewCount}</span>
            <RatingStars Review_Count={avgReviewCount} Star_Size={20} />
            <span>{`(${ratingAndReviews.length}) reviews`}</span>
            <span>{`${studentsEnrolled.length} students enrolled`}</span>
          </div>

          <p className="text-md text-gray-400 mt-2">
            Created by <span className="font-semibold">{instructor.firstName}</span>
          </p>

          <div className="flex items-center gap-x-3 mt-3 text-gray-400 text-sm">
            <p>Created on {formatDate(createdAt)}</p>
            <GrLanguage className="text-lg" />
            <span>English</span>
          </div>
        </div>

        {/* What You'll Learn */}
        <div className="bg-opacity-30 bg-white backdrop-blur-lg p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-semibold text-white">What You Will Learn</h2>
          <p className="text-gray-300 mt-3">{whatYouWillLearn}</p>
        </div>

        {/* Course Content */}
        <div className="bg-opacity-30 bg-white backdrop-blur-lg p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-semibold text-white">Course Content</h2>

          <div className="flex justify-between text-md text-gray-300 mt-2">
            <span>{courseContent?.length} section(s)</span>
            <span>{totalNoOfLectures} lectures</span>
          </div>

          <button
            onClick={() => setIsActive([])}
            className="mt-4 py-3 px-6 bg-transparent border border-gray-400 rounded-xl text-gray-300 hover:bg-gray-800 transition-all duration-300"
          >
            Collapse all Sections
          </button>
          {/* Course Details Accordion */}
          <div className="py-4">
              {sectionData?.map((course, index) => (
                <CourseAccordionBar
                  course={course}
                  key={index}
                  isActive={isActive}
                  handleActive={handleActive}
                />
              ))}
            </div>
          </div>
      </div>

      {/* Right Section - Course Details Card */}
      <div className="w-full md:w-[350px] lg:w-[400px] flex-shrink-0 md:ml-10">
        <CourseDetailsCard
          course={courseData?.data?.courseDetails}
          setConfirmationModal={setConfirmationModal}
          handleBuyCourse={handleBuyCourse}
        />
      </div>

      

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};

export default CourseDetails;
