import React from "react";
import { useSelector } from "react-redux";
import RenderCartCourses from "./RenderCartCourses";
import RenderTotalItems from "./RenderTotalItems";

export default function Cart() {
  const { total, totalItems } = useSelector((state) => state.cart);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-6 py-10 lg:px-20 bg-richblack-900 text-white">
      <h1 className="mb-6 text-4xl font-bold text-richblack-5 text-center">My Cart</h1>

      <p className="border-b border-b-richblack-400 pb-3 text-lg font-semibold text-richblack-300 w-full max-w-3xl text-center">
        {totalItems} {totalItems === 1 ? "Course" : "Courses"} in Cart
      </p>

      {total > 0 ? (
        <div className="mt-8 flex flex-col-reverse items-center gap-x-10 gap-y-10 lg:flex-row w-full max-w-5xl">
          {/* Courses List */}
          <div className="w-full lg:w-3/5 p-6 bg-richblack-800 rounded-xl shadow-md border border-richblack-700">
            <RenderCartCourses />
          </div>

          {/* Total Items & Checkout Section */}
          <div className="w-full lg:w-2/5 p-6 bg-richblack-800 rounded-xl shadow-md border border-richblack-700">
            <RenderTotalItems />
          </div>
        </div>
      ) : (
        <p className="mt-14 text-center text-2xl font-semibold text-richblack-200">
          Your Cart is Empty 😔
        </p>
      )}
    </div>
  );
}
