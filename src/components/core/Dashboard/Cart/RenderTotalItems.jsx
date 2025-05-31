import react from "react";
import { useDispatch, useSelector } from "react-redux";
import IconBtn from "../../../common/iconBtn";
import { buyCourse } from "../../../../services/operations/studentFeaturesAPI";
import { useNavigate } from "react-router-dom";

const RenderTotalItems = ()=>{

    const {total, cart} = useSelector((state)=>state.cart);
    const {user} = useSelector((state)=>state.profile)
    const {token} = useSelector((state)=>state.auth)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    

    const handleBuyCourse = ()=>{
        const courses = cart.map((course) => course._id);
        // console.log("Bought these courses", courses);
        buyCourse(token, courses, user, navigate, dispatch) 
    }
    
    return(
        <div className="text-white">
            <p>Total:</p>
            <p>Rs {total}</p>

            <IconBtn
            text={"Buy Now"}
            onClick={handleBuyCourse}
            customClasses={"w-full justify-center"}
            />
        </div>
    )
}

export default RenderTotalItems