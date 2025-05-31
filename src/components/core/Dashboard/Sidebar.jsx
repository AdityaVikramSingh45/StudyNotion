import React, { useState } from "react";
import {SidebarLinks} from "../../../data/dashboard-links"  
import {logout} from "../../../services/operations/authAPI"
import { useDispatch, useSelector } from "react-redux";
import SidebarLink from "./SidebarLink";
import { VscSettingsGear } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { VscSignOut } from "react-icons/vsc";
import ConfirmationModal from "../../common/ConfirmationModal";



const Sidebar = ()=>{

    const {loading:profileLoading} = useSelector( (state)=>state.profile );
    const {user} = useSelector( (state) => state.profile )
    const {loading:authLoading} = useSelector( (state)=>state.auth );
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [confirmationModal, setConfirmationModal] = useState(null);

    if(authLoading || profileLoading){
        return (
            <div className="mt-10">
                Loading......
            </div>
        )
    }

    

    return (
        <div className="flex flex-col min-w-[222px] border-r-[1px] border-richblack-700 h-[calc[100vh-3.5rem]] bg-richblack-800 py-10">

            <div className="flex flex-col">
                {
                    SidebarLinks.map( (link)=>{
                        if(link.type && user?.accountType !== link.type) return null
                        return(
                            <SidebarLink key={link.id} link={link} iconName={link.icon}/>
                        )
                    } )
                }
            </div>

            {/* Horizontal Line */}
            <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-600">
            </div>

            <div className="flex flex-col">
                <SidebarLink
                link={{name:"Settings", path:"dashboard/settings"}}
                iconName="VscSettingsGear"
                />

                <button
                    onClick = {
                        ()=>{
                            console.log("Logging out clicked......")
                            setConfirmationModal({
                                text1: "Are you sure?",
                                text2: "You will be logged out of your Account",
                                btn1Text: "Logout",
                                btn2Text: "Cancel",
                                btn1Handler: () => {
                                    console.log("Confirm Logout clicked"); // Debugging
                                    dispatch(logout(navigate));
                                },
                                btn2Handler: ()=> setConfirmationModal(null),
                            })
                        }
                    }
                    className="text-sm mx-8 mt-2 font-medium text-richblack-300"
                    >

                    <div className="flex items-center gap-x-2">
                        <VscSignOut className="text-lg"/>
                        <span>Logout</span>
                    </div>


                </button>
            </div>

            {confirmationModal && <ConfirmationModal modalData={confirmationModal}/>}



        </div>
    )
}

export default Sidebar