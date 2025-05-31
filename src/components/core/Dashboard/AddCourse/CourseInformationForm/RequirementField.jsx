import React, { useEffect, useState } from "react";

const RequirementField = ({ name, label, register, getValue, setValue, errors }) => {
  const [requirement, setRequirement] = useState("");
  const [requirementList, setRequirementList] = useState([]);

  useEffect(() => {
    register(name, {
      required: true,
    });
  }, [register, name]);

  useEffect(() => {
    setValue(name, requirementList);
  }, [requirementList, setValue, name]);

  const handleAddRequirement = () => {
    if (requirement) {
      setRequirementList([...requirementList, requirement]);
      setRequirement("");
    }
  };

  const handleRemoveRequirement = (index) => {
    const updatedRequirementList = [...requirementList];
    updatedRequirementList.splice(index, 1);
    setRequirementList(updatedRequirementList);
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-100" htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup>
      </label>
      <div className="flex items-center gap-x-2">
        <input
          type="text"
          id={name}
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          className="form-style w-full rounded-md bg-richblack-700 p-3 text-richblack-50 placeholder-richblack-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="Enter a requirement"
        />
        <button
          type="button"
          onClick={handleAddRequirement}
          className="flex items-center justify-center rounded-md bg-yellow-100 px-4 py-2 font-semibold text-richblack-900 hover:bg-yellow-200 transition-all duration-200"
        >
          Add
        </button>
      </div>

      {requirementList.length > 0 && (
        <ul className="space-y-2">
          {requirementList.map((requirement, index) => (
            <li
              key={index}
              className="flex items-center justify-between rounded-md bg-richblack-700 p-3 text-richblack-50"
            >
              <span>{requirement}</span>
              <button
                type="button"
                onClick={() => handleRemoveRequirement(index)}
                className="text-xs text-pink-200 hover:text-pink-400 transition-all duration-200"
              >
                Clear
              </button>
            </li>
          ))}
        </ul>
      )}

      {errors[name] && (
        <span className="ml-2 text-xs text-pink-200">{label} is required</span>
      )}
    </div>
  );
};

export default RequirementField;