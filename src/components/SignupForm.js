import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const SignupForm = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function changeHandler(event) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  }

  function submitHandler(event) {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsLoggedIn(true);
    toast.success("Account Created");
    console.log(formData);
    navigate("/dashboard");
  }

  return (
    <div>
      {/* Student-Instructor Tab */}
      <div className="flex bg-richblack-800 p-1 gap-x-1 my-6 rounded-full max-w-max">
        <button>Student</button>
        <button>Instructor</button>
      </div>

      <form onSubmit={submitHandler}>
        {/* firstName and lastName */}
        <div className="flex gap-x-4">
          <label className="w-full">
            <p className="text-richblack-5 mb-1 leading-[1.375rem]">
              First Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={changeHandler}
              placeholder="Enter First Name"
              className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
            />
          </label>
          <label className="w-full">
            <p className="text-richblack-5 mb-1 leading-[1.375rem]">
              Last Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={changeHandler}
              placeholder="Enter Last Name"
              className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
            />
          </label>
        </div>
        {/* Email Address*/}
        <label className="w-full">
          <p className="text-richblack-5 mb-1 leading-[1.375rem]">
            Email Address <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            type="email"
            name="email"
            value={formData.email}
            onChange={changeHandler}
            placeholder="Enter Email Address"
            className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
          />
        </label>
        {/* Create Password and Confirm Password */}
        <div className="flex gap-x-4">
          <label className="w-full relative">
            <p className="text-richblack-5 mb-1 leading-[1.375rem]">
              Create Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={changeHandler}
              placeholder="Enter Password"
              className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
            />
            <span
              className="absolute right-3 top-[38px] cursor-pointer"
              onClick={() => {
                setShowPassword((prev) => !prev);
              }}
            >
              {showPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </label>

          <label className="w-full relative">
            <p className="text-richblack-5 mb-1 leading-[1.375rem]">
              Confirm Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={changeHandler}
              placeholder="Confirm Password"
              className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
            />
            <span
              className="absolute right-3 top-[38px] cursor-pointer"
              onClick={() => {
                setShowConfirmPassword((prev) => !prev);
              }}
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </label>
        </div>
        <button className="bg-yellow-50 rounded-[8px] font-medium text-richblack-900 px-[12px] py-[8px] mt-6">
          Create Account
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
