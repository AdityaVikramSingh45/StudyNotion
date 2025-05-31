import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import IconBtn from "../../common/iconBtn";
import { FaEdit } from "react-icons/fa";

const MyProfile = () => {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen bg-richblack-900 p-6">
      <div className="w-full max-w-5xl bg-richblack-800 text-white rounded-xl shadow-lg p-12 space-y-12">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-center text-richblack-50">My Profile</h1>

        {/* Profile Info */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-richblack-700 p-10 rounded-xl border border-richblack-600">
          <div className="flex items-center gap-6">
            <img
              src={user?.image}
              alt={`profile-${user?.firstName}`}
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-500"
            />
            <div>
              <p className="text-2xl font-semibold">{user?.firstName + " " + user?.lastName}</p>
              <p className="text-sm text-richblack-300">{user?.email}</p>
            </div>
          </div>
          <button
            className="flex items-center gap-3 px-6 py-3 bg-yellow-500 text-richblack-900 rounded-lg font-semibold hover:bg-yellow-400 transition-all duration-200"
            onClick={() => navigate("/dashboard/settings")}
          >
            Edit
            <FaEdit className="text-lg" />
          </button>
        </div>

        {/* About Section */}
        <div className="bg-richblack-700 p-10 rounded-xl border border-richblack-600">
          <div className="flex justify-between items-center mb-6">
            <p className="text-2xl font-semibold">About</p>
            <IconBtn
              text="Edit"
              customClasses="px-6 py-2 bg-yellow-500 text-richblack-900 rounded-lg font-semibold hover:bg-yellow-400 transition-all duration-200"
              onClick={() => navigate("/dashboard/settings")}
              icon={<FaEdit className="text-lg" />}
            >
               <FaEdit className="text-lg" />
            </IconBtn>
          </div>
          <p className="text-richblack-200 text-lg">
            {user?.additionalDetails?.about || "Write something about yourself"}
          </p>
        </div>

        {/* Personal Details */}
        <div className="bg-richblack-700 p-10 rounded-xl border border-richblack-600">
          <div className="flex justify-between items-center mb-6">
            <p className="text-2xl font-semibold">Personal Details</p>
            <IconBtn
              text="Edit"
              customClasses="px-6 py-2 bg-yellow-500 text-richblack-900 rounded-lg font-semibold hover:bg-yellow-400 transition-all duration-200"
              onClick={() => navigate("/dashboard/settings")}
              icon={<FaEdit className="text-lg" />}
            >
              <FaEdit className="text-lg" />
            </IconBtn>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-lg mr-5 p-3">
            {[
              { label: "First Name", value: user?.firstName },
              { label: "Last Name", value: user?.lastName },
              { label: "Email", value: user?.email },
              { label: "Gender", value: user?.additionalDetails?.gender || "Add Gender" },
              { label: "Phone Number", value: user?.additionalDetails?.contactNumber || "Add Contact Number" },
              { label: "Date of Birth", value: user?.additionalDetails?.dateOfBirth || "Add Date of Birth" },
            ].map((item, index) => (
              <div key={index} className="p-2">
                <p className="text-sm text-richblack-300">{item.label}</p>
                <p className="text-richblack-50 font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
