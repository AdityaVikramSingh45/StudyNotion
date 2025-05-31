import react, { useState } from "react";
import { useForm } from "react-hook-form";
import IconBtn from "../../../../common/iconBtn";
import { IoIosAddCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineNavigateNext } from "react-icons/md";
import { setCourse, setEditCourse, setStep } from "../../../../../slices/courseSlice";
import toast from "react-hot-toast";
import { createSection, updateSection } from "../../../../../services/operations/courseDetailsAPI";
import NestedView from "./NestedView";
import { useEffect } from "react";

const CourseBuilderForm = ()=>{

    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const {token} = useSelector((state)=>state.auth);;

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [editSectionName, setEditSectionName] = useState(null);
    const {course} = useSelector((state)=>state.course);
    
    const handleCancelEdit = ()=>{
        setEditSectionName(null);
        setValue("sectionName", "")
    }

    const goBack = ()=>{
        console.log("Inside goBack");
        dispatch(setStep(1));
        dispatch(setEditCourse(true))
    }

    const goToNext = ()=>{
        if(course.courseContent.length === 0){
            toast.error("Please add atleast one section");
            return;
        }
        if(course.courseContent.some((section)=>section.subSection.length === 0)){
            toast.error("Please add atleast one sub-section in each section");
            return;
        }
        console.log("Inside goToNext")
        dispatch(setStep(3));
    }

    const onSubmit = async(data)=>{
        setLoading(true);
        console.log("Inside onSubmit");
        let result;
        console.log("course-->", course);
        console.log("data-->", data);

        if(editSectionName){
            result = await updateSection({
                courseId: course._id,
                sectionName: data.sectionName,
                sectionId: editSectionName
            }, token)
        }
        else{
            console.log("section name----->",data?.sectionName)
            result = await createSection({
                sectionName: data?.sectionName,
                courseId: course._id
            }, token)
        }
        console.log("resulttt---->", result);

        if(result){
            console.log("Inside result of courseBuilder")
            dispatch(setCourse(result));
            setEditSectionName(null);
            setValue("sectionName", "");
        }
        // console.log("sectionName", result?.courseContent?.sectionName);

        setLoading(false);
    }

    const handleChangeEditSectionName = (sectionId, sectionName)=>{
        if(editSectionName === sectionId){
            handleCancelEdit();
        }

        setEditSectionName(sectionId);
        setValue("sectionName", sectionName);
    }

    return(
        <div className="text-white space-y-8 p-6 bg-richblack-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-yellow-50 mb-6">Course Builder</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex flex-col gap-2">
                    <label className="text-richblack-5">
                        Section Name<sup className="text-pink-500">*</sup>
                        <input
                            type="text"
                            id="sectionName"
                            placeholder="Add section name"
                            {...register("sectionName", {required:true})}
                            className="w-full mt-2 p-3 bg-richblack-700 rounded-lg border border-richblack-600 focus:outline-none focus:border-yellow-50 transition-all duration-200"
                        />
                        {errors.sectionName && (
                            <span className="text-pink-500 text-sm mt-1">Section Name is required</span>
                        )}
                    </label>
                </div>
                
                <div className="flex items-center gap-4">
                    <IconBtn
                        type="Submit"
                        text={editSectionName ? "Edit Section Name" : "Create Section"}
                        customClasses="bg-yellow-50 text-richblack-900 hover:scale-95 transition-all duration-200"
                    >
                        <IoIosAddCircle size={20} />
                    </IconBtn>
                    
                    {editSectionName && (
                        <button 
                            onClick={handleCancelEdit} 
                            type="button" 
                            className="text-sm text-richblack-300 underline hover:text-yellow-50 transition-all duration-200"
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>

            {course?.courseContent?.length > 0 && (
                <div className="mt-8 border-t border-richblack-600 pt-6">
                    <NestedView handleChangeEditSectionName={handleChangeEditSectionName}/>
                </div>
            )}

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-richblack-600">
                <button 
                    onClick={goBack} 
                    className="px-6 py-3 rounded-lg bg-richblack-700 text-richblack-50 hover:bg-richblack-600 transition-all duration-200 flex items-center gap-2"
                >
                    Back
                </button>
                <IconBtn 
                    onClick={goToNext} 
                    text="Next"
                    customClasses="bg-yellow-50 text-richblack-900 hover:scale-95 transition-all duration-200"
                >
                    <MdOutlineNavigateNext size={20} />
                </IconBtn>
            </div>
        </div>
    )
}

export default CourseBuilderForm