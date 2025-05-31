import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { apiConnector } from "../../../../../services/apiconnector";
import { addCourseDetails, editCourseDetails, fetchCourseCategories } from "../../../../../services/operations/courseDetailsAPI";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import RequirementField from "./RequirementField";
import { setCourse, setStep } from "../../../../../slices/courseSlice";
import IconBtn from "../../../../common/iconBtn";
import toast from "react-hot-toast";
import { COURSE_STATUS } from "../../../../../utils/constants";
import ChipInput from "./ChipInput";
import Upload from "./Upload";
import { MdNavigateNext } from "react-icons/md";

const CourseInformationForm = () => {
  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm();
  const { step } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { course, editCourse } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState([]);

  useEffect(() => {
    console.log("Updated Step:", step);
    console.log("Edit Course--->", editCourse)
  }, [step]);

  useEffect(()=>{
    let parsedInstructions = [];
    try {
      parsedInstructions = Array.isArray(course?.instructions)
        ? course?.instructions
        : JSON.parse(course?.instructions || "[]");
    } catch (error) {
      console.error("Error parsing instructions:", error);
      parsedInstructions = [];
    }
    
    setValue("courseTitle", course?.courseName);
    setValue("courseShortDesc", course?.courseDescription);
    setValue("coursePrice", course?.price);
    setValue("courseTags", course?.tag);
    setValue("courseBenefits", course?.whatYouWillLearn);
    setValue("courseCategory", course?.category);
    // setValue("courseRequirements", course?.courseDetails?.instructions);
    setValue("courseImage", course?.thumbnail);
    setValue("courseRequirements", parsedInstructions);
  }, [step == 1])


  useEffect(() => {
    const getCategories = async () => {
      const courseCategories = await fetchCourseCategories();
      // console.log("Categories inside courseDetailInfo", courseCategories);
      if (courseCategories?.length > 0) {
        setCourseCategories(courseCategories);
      }
      setLoading(false);
    };

    if (editCourse) {
      console.log("course", course)
      
    let parsedInstructions = [];
    try {
      parsedInstructions = Array.isArray(course?.courseDetails?.instructions)
        ? course?.courseDetails?.instructions
        : JSON.parse(course?.courseDetails?.instructions || "[]");
    } catch (error) {
      console.error("Error parsing instructions:", error);
      parsedInstructions = [];
    }

      setValue("courseTitle", course?.courseDetails?.courseName);
      setValue("courseShortDesc", course?.courseDetails?.courseDescription);
      setValue("coursePrice", course?.courseDetails?.price);
      setValue("courseTags", course?.courseDetails?.tag);
      setValue("courseBenefits", course?.courseDetails?.whatYouWillLearn);
      setValue("courseCategory", course?.courseDetails?.category);
      // setValue("courseRequirements", course?.courseDetails?.instructions);
      setValue("courseImage", course?.courseDetails?.thumbnail);
      setValue("courseRequirements", parsedInstructions);

    }
    getCategories();
    // console.log("Rendering")
  }, []);

  // const isFormUpdated = () => {
  //   const currentValues = getValues();

  //   console.log("course inside isFormUpdated", course.courseDetails)

  //   if (
  //     currentValues.courseTitle !== course.courseName ||
  //     currentValues.courseShortDesc !== course.courseDescription ||
  //     currentValues.coursePrice !== course.price ||
  //     currentValues.courseTag.toString() !== course.tag.toString() ||
  //     currentValues.courseBenefits !== course.whatYouWillLearn ||
  //     currentValues.courseCategory._id !== course.category._id ||
  //     currentValues.courseImage !== course.thumbnail ||
  //     currentValues.courseRequirements.toString() !== course.instructions.toString()
  //   )
  //     return true;
  //   return false;
  // };

  const isFormUpdated = () => {
    const currentValues = getValues();
    console.log("currrentValues-->>", currentValues);
  
    const currentInstructions = Array.isArray(currentValues.courseRequirements)
    ? currentValues.courseRequirements.join(', ')
    : currentValues.courseRequirements;

    const storedInstructions = Array.isArray(course.courseDetails.instructions)
    ? course.courseDetails.instructions.join(', ')
    : course.courseDetails.instructions;
 

  
    return (
      currentValues.courseTitle !== course.courseDetails.courseName ||
      currentValues.courseShortDesc !== course.courseDetails.courseDescription ||
      currentValues.coursePrice !== course.courseDetails.price ||
      currentValues.courseTags.toString() !== course.courseDetails.tag.toString() ||
      currentValues.courseBenefits !== course.courseDetails.whatYouWillLearn ||
      currentValues.courseCategory._id !== course.courseDetails.category._id ||
      currentValues.courseImage !== course.courseDetails.thumbnail ||
      // JSON.stringify(currentInstructions) !== JSON.stringify(storedInstructions)
      currentInstructions !== storedInstructions
    );
  };

  // // ✅ Added normalize function
  // const normalize = (arr) => {
  //   return arr
  //     .map((item) => item?.toString().trim().toLowerCase())
  //     .filter((item) => item !== "")
  //     .filter((item, index, self) => self.indexOf(item) === index);
  // };
  
  const onSubmit = async (data) => {
    console.log("Inside onSubmit");
    if (editCourse) {
      if (isFormUpdated()) {
        const currentValues = getValues();
        console.log("currentvalues--->",currentValues);
        const formData = new FormData();

        formData.append("courseId", course.courseDetails._id);

        // **Merge and normalize instructions properly**
        const newInstructions = Array.isArray(data.courseRequirements)
        ? data.courseRequirements.map((item) => item.trim().toLowerCase())
        : [data.courseRequirements.trim().toLowerCase()];
      
      const existingInstructions = Array.isArray(course?.courseDetails?.instructions)
        ? course.courseDetails.instructions.map((item) => item.trim().toLowerCase())
        : [];
      
      // **Normalize first, then merge and remove duplicates**
      const mergedInstructions = [...new Set([...existingInstructions, ...newInstructions])]
        .filter((item) => item !== "");  // Remove empty strings
      
      formData.append("instructions", JSON.stringify(mergedInstructions));
       console.log("Merged Instructions:", mergedInstructions);

        if (currentValues.courseTitle !== course.courseDetails.courseName) {
          formData.append("courseName", data.courseTitle);
        }
        
        if (currentValues.courseShortDesc !== course.courseDetails.courseDescription) {
          formData.append("courseDescription", data.courseShortDesc);
        }
      
        if (currentValues.coursePrice !== course.courseDetails.price) {
          formData.append("price", data.coursePrice);
        }
        
        if (currentValues.courseTags.toString() !== course.courseDetails.tag.toString()) {
          //  Clean and Flatten the Tags Before Appending
             const cleanTags = Array.isArray(data.courseTags) 
             ? data.courseTags.flat().map(tag => tag.trim())   // Flatten and trim
             : [data.courseTags.trim()];
             
             
             formData.delete("tag");
             
             // Append clean, stringified JSON once
             formData.append("tag", JSON.stringify(cleanTags));

             console.log("Sent tags:", cleanTags);              
        }

        if (currentValues.courseBenefits !== course.courseDetails.whatYouWillLearn) {
          formData.append("whatYouWillLearn", data.courseBenefits);
        }
        
        if (currentValues.courseCategory._id !== course.courseDetails.category._id) {
          formData.append("category", data.courseCategory);
        }
      
        
        if (currentValues.courseImage !== course.courseDetails.thumbnail) {
          formData.append("thumbnail", data.courseImage);
        }
        
        setLoading(true);
        const result = await editCourseDetails(formData, token);
        console.log("Result---->", result);
        // setLoading(true);
        if (result) {
          dispatch(setStep(2));
          dispatch(setCourse(result));
        }
      } else {
        toast.error("No changes made so far");
      }
      return;
    }

    // Create a new course
    const formData = new FormData();
    formData.append("courseName", data.courseTitle);
    formData.append("courseDescription", data.courseShortDesc);
    formData.append("price", data.coursePrice);
    formData.append("tag", JSON.stringify(data?.courseTags));
    formData.append("whatYouWillLearn", data.courseBenefits);
    formData.append("category", data.courseCategory);
    formData.append("status", COURSE_STATUS.DRAFT);
    // formData.append("instructions", JSON.stringify(data.courseRequirements))
    formData.append("thumbnail", data?.courseImage);
    const instructions = Array.isArray(data.courseRequirements)
        ? data.courseRequirements.map(item => item.trim())
        : [data.courseRequirements.trim()];

    formData.append("instructions", JSON.stringify(instructions));    
    setLoading(true);

    const result = await addCourseDetails(formData, token);
    console.log("Result inside onSubmit", result);
    if (result) {
      dispatch(setStep(2));
      dispatch(setCourse(result));
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-lg border border-richblack-700 bg-richblack-800 p-8 shadow-lg"
    >
      {/* Course Title */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-100" htmlFor="courseTitle">
          Course Title <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="courseTitle"
          placeholder="Enter Course Title"
          {...register("courseTitle", { required: true })}
          className="form-style w-full rounded-md bg-richblack-700 p-3 text-richblack-50 placeholder-richblack-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        {errors.courseTitle && (
          <span className="ml-2 text-xs text-pink-200">Course title is required</span>
        )}
      </div>

      {/* Course Short Description */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-100" htmlFor="courseShortDesc">
          Course Short Description <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseShortDesc"
          placeholder="Enter Description"
          {...register("courseShortDesc", { required: true })}
          className="form-style w-full rounded-md bg-richblack-700 p-3 text-richblack-50 placeholder-richblack-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        {errors.courseShortDesc && (
          <span className="ml-2 text-xs text-pink-200">Course Description is required</span>
        )}
      </div>

      {/* Course Price */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-100" htmlFor="coursePrice">
          Course Price <sup className="text-pink-200">*</sup>
        </label>
        <div className="relative">
          <input
            id="coursePrice"
            placeholder="Enter Course Price"
            className="form-style w-full rounded-md bg-richblack-700 p-3 pl-12 text-richblack-50 placeholder-richblack-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            {...register("coursePrice", {
              required: true,
              valueAsNumber: true,
              pattern: {
                value: /^(0|[1-9]\d*)(\.\d+)?$/,
              },
            })}
          />
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
        </div>
        {errors.coursePrice && (
          <span className="ml-2 text-xs text-pink-200">Course Price is required</span>
        )}
      </div>

      {/* Course Category */}
      <div className="flex flex-col space-y-2">
         <label className="text-sm text-richblack-100" htmlFor="courseCategory">
         Course Category <sup className="text-pink-200">*</sup>
      </label>
      <select
       {...register("courseCategory", { required: true })}
       className="form-style w-full rounded-md bg-richblack-700 p-3 text-richblack-50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
       defaultValue=""
       >
      <option value="" disabled selected>
      Choose a Category
      </option>
      {!loading &&
      (courseCategories || []).map((category) => (
        <option key={category._id} value={category._id}>
          {category.name}
        </option>
      ))}
     </select>
     {errors.courseCategory && (
      <span className="ml-2 text-xs text-pink-200">
          Course Category is required
     </span>
      )}
    </div>


      {/* Course Tags */}
      <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Enter Tags and press Enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />

      {/* Course Thumbnail Image */}
      <Upload
        name="courseImage"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.courseDetails?.thumbnail : null}
      />

      {/* Benefits of the course */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-100" htmlFor="courseBenefits">
          Benefits of the course <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseBenefits"
          placeholder="Enter benefits of the course"
          {...register("courseBenefits", { required: true })}
          className="form-style w-full rounded-md bg-richblack-700 p-3 text-richblack-50 placeholder-richblack-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        {errors.courseBenefits && (
          <span className="ml-2 text-xs text-pink-200">Benefits of the course is required</span>
        )}
      </div>

      {/* Requirements/Instructions */}
      <RequirementField
        name="courseRequirements"
        label="Requirements/Instructions"
        register={register}
        setValue={setValue}
        errors={errors}
        getValues={getValues}
      />

      {/* Next Button */}
      <div className="flex justify-end gap-x-2">
        {editCourse && (
          <button
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-2 px-4 font-semibold text-richblack-900 hover:bg-richblack-400 transition-all duration-200`}
          >
            Continue Without Saving
          </button>
        )}
        <IconBtn
          type="submit"
          customClasses="bg-yellow-100 px-4 py-2 flex text-black items-center gap-2 font-semibold rounded-md hover:bg-yellow-200 transition-all duration-200"
          disabled={loading}
          text={!editCourse ? "Next" : "Save Changes"}
        >
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  );
};

export default CourseInformationForm;