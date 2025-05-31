import RenderSteps from "./RenderSteps"

export default function AddCourse() {
  return (
    <>
      <div className="flex w-full ml-12 mt-2 mb-2 justify-between ">
        <div className="flex flex-col w-[80%] mr-10">
          <h1 className="mb-14 text-3xl font-medium text-richblack-5">
            Add Course
          </h1>
          <div className="flex-1">
            <RenderSteps />
          </div>
        </div>
        {/* Course Upload Tips */}
        <div className="sticky ml-12 gap-x-3 mx-auto right-10 top-10 hidden w-[50%] h-max rounded-xl border-2 border-richblack-700 bg-richblack-800 p-6 xl:block">
          <p className="mb-8 text-lg text-richblack-5">⚡ Course Upload Tips</p>
          <ul className="ml-5 list-item list-disc space-y-4 text-xs text-richblack-5">
            <li>Set the Course Price option or make it free.</li>
            <li>Standard size for the course thumbnail is 1024x576.</li>
            <li >Video section controls the course overview video.</li>
            <li >Course Builder is where you create & organize a course.</li>
            <li >
              Add Topics in the Course Builder section to create lessons,
              quizzes, and assignments.
            </li>
            <li>
              Information from the Additional Data section shows up on the
              course single page.
            </li>
            <li>Make Announcements to notify any important</li>
          </ul>
        </div>
      </div>
    </>
  )
}