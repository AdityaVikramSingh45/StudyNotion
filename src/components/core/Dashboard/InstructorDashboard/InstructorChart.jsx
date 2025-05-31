import React, { useState } from "react";
import { Chart, registerables } from "chart.js";
import { Pie } from "react-chartjs-2";

Chart.register(...registerables);

const InstructorChart = ({ courses }) => {
  const [currChart, setCurrChart] = useState("students");

  // Function to generate random colors
  const getRandomColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )})`;
      colors.push(color);
    }
    return colors;
  };

  // Create data for chart displaying student info
  const chartDataForStudents = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course?.totalStudentsEnrolled),
        backgroundColor: getRandomColors(courses?.length),
      },
    ],
  };

  // Create data for chart displaying income info
  const chartDataForIncome = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course?.totalAmountGenerated),
        backgroundColor: getRandomColors(courses?.length),
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#ffffff", // White text for legend
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <div className="bg-richblack-800 rounded-xl p-6 shadow-lg">
      {/* Chart Header */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-xl font-semibold text-richblack-50">Visualize</p>
        <div className="flex gap-3">
          <button
            onClick={() => setCurrChart("students")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currChart === "students"
                ? "bg-yellow-500 text-richblack-900"
                : "bg-richblack-700 text-richblack-50 hover:bg-richblack-600"
            }`}
          >
            Students
          </button>
          <button
            onClick={() => setCurrChart("income")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currChart === "income"
                ? "bg-yellow-500 text-richblack-900"
                : "bg-richblack-700 text-richblack-50 hover:bg-richblack-600"
            }`}
          >
            Income
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-[400px]">
        <Pie
          data={currChart === "students" ? chartDataForStudents : chartDataForIncome}
          options={options}
        />
      </div>
    </div>
  );
};

export default InstructorChart;