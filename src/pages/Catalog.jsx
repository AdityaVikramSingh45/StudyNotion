import React, { useEffect, useState } from "react";
import Footer from "../components/common/Footer";
import { apiConnector } from "../services/apiconnector";
import { useParams } from "react-router-dom";
import { categories } from "../services/apis";
import { getCatalogPageData } from "../services/operations/pageAndComponentData";
import CourseSlider from "../components/core/Catalog/CourseSlider";
import Course_Card from "../components/core/Catalog/Course_Card";

const Catalog = () => {
  const { catalogName } = useParams();
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");

  // Fetch all categories
  useEffect(() => {
    const getCategories = async () => {
      const response = await apiConnector("GET", categories.CATEGORIES_API);
      const category = response?.data?.data?.find(
        (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
      );
      setCategoryId(category?._id);
    };
    getCategories();
  }, [catalogName]);

  // Fetch category details
  useEffect(() => {
    const getCategoryDetails = async () => {
      if (!categoryId) return;
      try {
        const res = await getCatalogPageData(categoryId);
        setCatalogPageData(res);
      } catch (error) {
        console.log(error);
      }
    };
    getCategoryDetails();
  }, [categoryId]);

  return (
    <div className="text-white bg-richblack-900 min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="py-6 px-6 lg:px-20 text-richblack-300">
        <p className="text-sm">
          <span className="text-richblack-400">Home</span> /{" "}
          <span className="text-richblack-400">Catalog</span> /{" "}
          <span className="text-yellow-200">
            {catalogPageData?.data?.selectedCategory?.name}
          </span>
        </p>
      </div>

      {/* Catalog Header */}
      <div className="px-6 lg:px-20 py-6 text-center">
        <h1 className="text-3xl font-semibold text-yellow-200">
          {catalogPageData?.data?.selectedCategory?.name}
        </h1>
        <p className="text-richblack-300 mt-2 text-sm max-w-2xl mx-auto">
          {catalogPageData?.data?.selectedCategory?.description}
        </p>
      </div>

      {/* Section 1: Courses to Get Started */}
      <div className="px-6 lg:px-20 py-8">
        <h2 className="text-2xl font-bold text-white">Courses to Get You Started</h2>
        <div className="flex gap-x-4 mt-4 text-sm text-richblack-300">
          <p className="cursor-pointer hover:text-yellow-200">Most Popular</p>
          <p className="cursor-pointer hover:text-yellow-200">New</p>
        </div>
        <div className="mt-4">
          <CourseSlider courses={catalogPageData?.data?.selectedCategory?.course} />
        </div>
      </div>

      {/* Section 2: Top Courses in this Category */}
      <div className="px-6 lg:px-20 py-8">
        <h2 className="text-2xl font-bold text-white">
          Top Courses in {catalogPageData?.data?.selectedCategory?.name}
        </h2>
        <div className="mt-4">
          <CourseSlider courses={catalogPageData?.data?.selectedCategory?.course} />
        </div>
      </div>

      {/* Section 3: Frequently Bought Together */}
      <div className="px-6 lg:px-20 py-8">
        <h2 className="text-2xl font-bold text-white">Frequently Bought Together</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {catalogPageData?.data?.mostSellingCourses?.slice(0, 4).map((course) => (
            <Course_Card key={course._id} course={course} Height={"h-[300px]"} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Catalog;
