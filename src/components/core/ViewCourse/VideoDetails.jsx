import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI";
import { updateCompletedLectures } from "../../../slices/viewCourseSlice";
import { BigPlayButton, Player } from "video-react";
import "video-react/dist/video-react.css";

const VideoDetails = () => {
  const { token } = useSelector((state) => state.auth);
  const { courseId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const playerRef = useRef();
  const { courseSectionData, completedLectures } = useSelector(
    (state) => state.viewCourse
  );
  const location = useLocation();

  const [videoData, setVideoData] = useState(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!courseSectionData.length) return;
    const section = courseSectionData.find((s) => s._id === sectionId);
    if (!section) return;
    const subSection = section.subSection.find((s) => s._id === subSectionId);
    if (!subSection) return;
    setVideoData(subSection);
    setVideoEnded(false);
  }, [courseSectionData, location.pathname]);

  const isFirstVideo =
    courseSectionData[0]?._id === sectionId &&
    courseSectionData[0]?.subSection[0]?._id === subSectionId;

  const isLastVideo =
    courseSectionData[courseSectionData.length - 1]?._id === sectionId &&
    courseSectionData[courseSectionData.length - 1]?.subSection[
      courseSectionData[courseSectionData.length - 1].subSection.length - 1
    ]?._id === subSectionId;

  const goToVideo = (next = true) => {
    const currentSectionIndex = courseSectionData.findIndex(
      (s) => s._id === sectionId
    );
    const currentSubIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
      (s) => s._id === subSectionId
    );

    if (next) {
      if (
        currentSubIndex <
        courseSectionData[currentSectionIndex].subSection.length - 1
      ) {
        navigate(
          `/view-course/${courseId}/section/${sectionId}/sub-section/${courseSectionData[currentSectionIndex].subSection[currentSubIndex + 1]._id}`
        );
      } else if (currentSectionIndex < courseSectionData.length - 1) {
        navigate(
          `/view-course/${courseId}/section/${courseSectionData[currentSectionIndex + 1]._id}/sub-section/${courseSectionData[currentSectionIndex + 1].subSection[0]._id}`
        );
      }
    } else {
      if (currentSubIndex > 0) {
        navigate(
          `/view-course/${courseId}/section/${sectionId}/sub-section/${courseSectionData[currentSectionIndex].subSection[currentSubIndex - 1]._id}`
        );
      } else if (currentSectionIndex > 0) {
        const prevSection = courseSectionData[currentSectionIndex - 1];
        navigate(
          `/view-course/${courseId}/section/${prevSection._id}/sub-section/${prevSection.subSection[prevSection.subSection.length - 1]._id}`
        );
      }
    }
  };

  const handleLectureCompletion = async () => {
    setLoading(true);
    const res = await markLectureAsComplete(
      { courseId, subSectionId },
      token
    );
    if (res) dispatch(updateCompletedLectures(subSectionId));
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {!videoData ? (
        <p className="text-lg font-semibold text-gray-400">No Video Available</p>
      ) : (
        <div className="w-full max-w-4xl">
          <Player
            ref={playerRef}
            aspectRatio="16:9"
            playsInline
            onEnded={() => setVideoEnded(true)}
            src={videoData.videoUrl}
            className="rounded-lg overflow-hidden shadow-lg"
          >
            <BigPlayButton position="center" />
          </Player>

          {videoEnded && (
            <div className="mt-6 flex  items-center gap-4">
              {!completedLectures.includes(subSectionId) && (
                <button
                disabled={loading}
                onClick={handleLectureCompletion}
                className="px-6 py-2 rounded-lg bg-pink-600 text-white font-semibold shadow-md hover:bg-pink-700 transition duration-300 ease-in-out transform hover:scale-105"
              >
                {loading ? "Loading..." : "Mark as Completed"}
              </button>
              
              )}

              <button
                disabled={loading}
                onClick={() => {
                  if (playerRef?.current) {
                    playerRef.current.seek(0);
                    setVideoEnded(false);
                  }
                }}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                Rewatch
              </button>

              <div className="flex gap-4">
                {!isFirstVideo && (
                  <button
                    onClick={() => goToVideo(false)}
                    className="px-6 py-2 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-800 transition"
                  >
                    Previous
                  </button>
                )}
                {!isLastVideo && (
                  <button
                  onClick={() => goToVideo(true)}
                  className="px-6 py-2 rounded-lg bg-pink-600 text-white font-semibold shadow-md hover:bg-pink-700 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Next
                </button>
                
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoDetails;
