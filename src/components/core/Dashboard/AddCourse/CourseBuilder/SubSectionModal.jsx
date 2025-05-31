import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setCourse } from "../../../../../slices/courseSlice";
import { createSubSection, updateSubSection } from "../../../../../services/operations/courseDetailsAPI";
import { GiCrossMark } from "react-icons/gi";
import IconBtn from "../../../../common/iconBtn";
import Upload from "../CourseInformationForm/Upload";

const SubSectionModal = ({
    modalData,
    setModalData,
    edit = false,
    view = false,
    add = false
})=>{

    const {
        register,
        getValues,
        setValue,
        formState: {errors},
        handleSubmit
    } = useForm()

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const {course} = useSelector((state)=>state.course)
    const {token} = useSelector((state)=>state.auth)

    useEffect(() => {
        if (view || edit) {
            setValue("lectureTitle", modalData.title);
            setValue("lectureDesc", modalData.description);
            setValue("lectureVideo", modalData.videoUrl);
        }
    }, [modalData, view, edit, setValue]);
    

    const isFormUpdated = ()=>{
        const currentValues = getValues();
        if(currentValues.lectureTitle !== modalData.title || 
            currentValues.lectureDesc !== modalData.description ||
            currentValues.lectureVideo !== modalData.videoUrl 
        ) return true;
        else return false
    }
    const handleEditSubSection = async()=>{
        const currentValues = getValues();
        const formData = new FormData();
        console.log("ModalData", modalData);
        formData.append("sectionId", modalData.sectionId);
        formData.append("subSectionId", modalData._id);

        if(currentValues.lectureTitle !== modalData.title){
            formData.append("title", currentValues.lectureTitle)
        }

        if(currentValues.lectureDesc !== modalData.description){
            formData.append("description", currentValues.lectureDesc)
        }

        if(currentValues.lectureVideo !== modalData.videoUrl){
            formData.append("videoUrl", currentValues.lectureVideo)
        }

        setLoading(true);
        const result = await updateSubSection(formData, token)
        if(result){
            const updateCourseContent = course.courseContent.map((section) => {
                return section._id === modalData.sectionId ? result : section
            })
            const updatedCourse = {...course, courseContent: updateCourseContent}

            dispatch(setCourse(updatedCourse));
        }

        setModalData(null);
        setLoading(false)
    }

    const onSubmit = async(data)=>{
        if(view){
            return;
        }
        if(edit){
            if(!isFormUpdated()){
                toast.error("No Changes Made")
            }else{
                handleEditSubSection();
            }
        }
        console.log("ModalData", modalData);
        const formData = new FormData();
        formData.append("sectionId", modalData);
        formData.append("title", data.lectureTitle);
        formData.append("description", data.lectureDesc);
        formData.append("videoUrl", data.lectureVideo);
        setLoading(true);

        const result = await createSubSection(formData, token)
        
        if(result){
            const updateCourseContent = course.courseContent.map((section) => {
                return section._id === modalData ? result : section
            })
            const updatedCourse = {...course, courseContent: updateCourseContent}

            dispatch(setCourse(updatedCourse))
        }

        setModalData(null);
        setLoading(false);
    }

    return(
        <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
            <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
                <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
                    <p className="text-xl font-semibold text-richblack-5">
                        {view && "Viewing"}{add && "Adding"} {edit && "Editing"} Lecture
                    </p>
                    <button 
                        onClick={()=> (!loading ? setModalData(null) : {})}
                        className="text-2xl text-richblack-5 hover:text-richblack-25 transition-all duration-200"
                    >
                        <GiCrossMark />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 px-8 py-10">
                    <Upload
                        name="lectureVideo"
                        label="Lecture Video"
                        register={register}
                        setValue={setValue}
                        errors={errors}
                        video={true}
                        viewData={view ? modalData.videoUrl: null}
                        editData={edit ? modalData.videoUrl : null}
                    />

                    <div className="flex flex-col space-y-2">
                        <label className="text-sm text-richblack-5">
                            Lecture Title
                            <input 
                                id="lectureTitle"
                                {...register("lectureTitle", {required: true})}
                                className="form-style w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 focus:shadow-[0_1px_0_0] focus:shadow-yellow-50"
                                placeholder="Enter lecture title"
                            />
                        </label>
                        {errors.lectureTitle && (
                            <span className="ml-2 text-xs tracking-wide text-pink-200">
                                Lecture title is required
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label className="text-sm text-richblack-5">
                            Lecture Description
                            <textarea 
                                id="lectureDesc"
                                {...register("lectureDesc", {required: true})}
                                className="form-style resize-none min-h-[130px] w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 focus:shadow-[0_1px_0_0] focus:shadow-yellow-50"
                                placeholder="Enter lecture Description"
                            />
                        </label>
                        {errors.lectureDesc && (
                            <span className="ml-2 text-xs tracking-wide text-pink-200">
                                Lecture Description is required
                            </span>
                        )}
                    </div>

                    {!view && (
                        <div className="flex justify-end">
                            <IconBtn
                                text={loading ? "Loading..." : edit ? "Save Changes" : "Save"}
                                disabled={loading}
                            />
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}

export default SubSectionModal;