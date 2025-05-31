import React from "react";
import * as Icons from "react-icons/vsc"
import { useDispatch } from "react-redux";
import { matchPath, NavLink, useLocation } from "react-router-dom";

const SidebarLink = ({link, iconName})=>{

    const Icon = Icons[iconName];
    const location = useLocation();
    const dispatch = useDispatch();

    const matchRoute = (route)=>{
        return matchPath({path:route}, location.pathname)
    }

    return(
        <NavLink to = {link.path} className={` relative px-8 py-2 text-sm font-medium ${matchRoute(link.path) ? "bg-yellow-600 " : "bg-opacity-0"}`}>

            {/* Left Selected vertical line or border */}
            <span className={` ${matchRoute(link.path) ? "bg-opacity-100" : "bg-opacity-0"} absolute left-0 top-0 h-full w-[0.2rem] bg-yellow-50`}>
            </span>

            {/* Icon and Link */}
            <div className="flex items-center gap-x-2 ">
                <Icon className="text-lg "/>
                <span>{link.name}</span>
            </div>

        </NavLink>
    )
}

export default SidebarLink