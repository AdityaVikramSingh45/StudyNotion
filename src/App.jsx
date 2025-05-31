import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../src/pages/Home"
import "./App.css"
import Navbar from "./components/common/Navbar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import OpenRoute from "./components/core/auth/OpenRoute";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/updatePassword";
import VerifyEmail from "./pages/verifyEmail";
import About from "../src/pages/About"
import Dashboard from "./pages/Dashboard";
import Error from "../src/pages/Error"
import MyProfile from "../src/components/core/Dashboard/MyProfile"
import { Outlet } from "react-router-dom";
import PrivateRoute from "./components/core/auth/PrivateRoute";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./slices/profileSlice";
import { useEffect } from "react";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/Cart";
import { ACCOUNT_TYPE } from "./utils/constants";
import AddCourse from "../src/components/core/Dashboard/AddCourse"
import CourseBuilderForm from "./components/core/Dashboard/AddCourse/CourseBuilder/CourseBuilderForm";
import MyCourses from "./components/core/Dashboard/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import ViewCourse from "../src/pages/ViewCourse"
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor";
import Settings from "./components/core/Dashboard/Settings";
import Contact from "./pages/Contact";

const App = () => {

  const dispatch = useDispatch();
  const {user} = useSelector((state)=>state.profile)

  useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
          dispatch(setUser(JSON.parse(storedUser)));  // Restore user data in Redux
      }
  }, [dispatch]);

    return (
      <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
        <Navbar/>
        
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/catalog/:catalogName" element={<Catalog/>} />
            <Route path="/courses/:courseId" element={<CourseDetails/>} />
            <Route path="/signup" element={<OpenRoute><Signup/></OpenRoute>} />
            <Route path="/login" element={<OpenRoute><Login/></OpenRoute>} />
            <Route path="/forgot-password" element={<OpenRoute><ForgotPassword/></OpenRoute>} />
            <Route path="/update-password/:id" element={<OpenRoute><UpdatePassword/></OpenRoute>} />
            <Route path="/verify-email" element={<OpenRoute><VerifyEmail/></OpenRoute>} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            <Route element={<PrivateRoute><Dashboard/></PrivateRoute>}>
                <Route path="/dashboard/my-profile" element={<MyProfile />} />
      
                <Route path="dashboard/Settings" element={<Settings />} />

                {
                  user?.accountType === ACCOUNT_TYPE.STUDENT && (
                    <>
                        <Route path="/dashboard/enrolled-courses" element={<EnrolledCourses/>} />
                        <Route path="/dashboard/cart" element={<Cart/>} />
                    </>
                  )
                }
                {
                  user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
                    <>
                        <Route path="/dashboard/add-course" element={<AddCourse/>} />
                        <Route path="/dashboard/my-courses" element={<MyCourses/>} />
                        <Route path="/dashboard/edit-course/:courseId" element={<EditCourse/>} />
                        <Route path="/dashboard/instructor" element={<Instructor/>} />

                        
                    </>
                  )
                }
            </Route >

            <Route element={ <PrivateRoute> <ViewCourse/> </PrivateRoute> }>

                {
                  user?.accountType === ACCOUNT_TYPE.STUDENT && (
                    <>
                        <Route
                        path="/view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                        element = { <VideoDetails/> }
                        />
                    </>
                  )
                }
                
                

            </Route>

            <Route path="*" element={<Error/>} />
        </Routes>
        
      </div>
        
    );
};

export default App;
