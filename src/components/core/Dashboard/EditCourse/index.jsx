import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import RenderSteps from "../AddCourse/RenderSteps";
import { getFullDetailsOfCourse } from "../../../../services/operations/courseDetailsAPI";
import { setCourse, setEditCourse } from "../../../../slices/courseSlice";

const EditCourse = ()=>{

    const dispatch = useDispatch();
    const {courseId} = useParams();
    const {course} = useSelector((state)=>state.course)
    const [loading, setLoading] = useState(false);
    const {token} = useSelector((state)=>state.auth)

    //Editing of courses isn't working in index.jsx in edit courses in Dashboard

    useEffect(()=>{
        const populateCourse = async()=>{
            setLoading(true);
            const result = await getFullDetailsOfCourse(courseId, token);
            console.log("result--->",result)
            if(result){
                dispatch(setEditCourse(true));
                dispatch(setCourse(result))
            }
            setLoading(false);
        }
        populateCourse()
    }, [])

    if(loading){
        return(
            <div className="text-white">
                Loading.....
            </div>
        )
    }

    return(
        <div>
            <h1 className="text-white">Edit Course</h1>
            {
                course ? (<RenderSteps/>) : <p className="text-white">Course Not Found</p>
            }
        </div>
    )
}

export default EditCourse