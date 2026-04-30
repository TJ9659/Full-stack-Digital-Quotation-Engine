import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const QuotationForm = () => {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // Connecting to your Java Spring Boot API
      const response = await axios.post(
        "http://localhost:8080/api/quotations/calculate",
        data,
      );
      setResult(response.data);
    } catch (error) {
      console.error("Connection error:", error);
      alert(
        "Backend not reachable. Ensure Spring Boot is running on port 8080.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black">
            LMS Quotation System
          </h2>
          <p className="text-gray-500 mt-2">
            Enter prospect details to generate a life insurance quote.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              {...register("prospectName", { required: "Name is required" })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="e.g. Ahmad Razak"
            />
            {errors.prospectName && (
              <span className="text-xs text-red-500">
                {errors.prospectName.message}
              </span>
            )}
          </div>

          <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                {...register("gender", { required: true })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                type="number"
                min="18"
                onKeyDown={(e) => {
                  if (
                    !/^[0-9]$/.test(e.key) &&
                    e.key !== "Backspace" &&
                    e.key !== "Delete"
                  ) {
                    e.preventDefault();
                  }
                }}
                {...register("age", {
                  required: "Required",
                  min: { value: 18, message: "Min 18" },
                  max: { value: 70, message: "Max 70" },
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              {errors.age && (
                <span className="text-xs text-red-500">
                  {errors.age.message}
                </span>
              )}
            </div>
          

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Occupation Class
              </label>
              <select
                {...register("occupation", { required: true })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="CLASS_1">Class 1 (Office)</option>
                <option value="CLASS_2">Class 2 (Field)</option>
                <option value="CLASS_3">Class 3 (Hazard)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center flex-row gap-2">
                        <label className="block text-sm font-medium text-gray-700 cursor-pointer">
              Is the person a smoker?
            </label>
            <input
              type="checkbox"
              {...register("isSmoker")}
              className="w-4 h-4 accent-black cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sum Assured (MYR)
            </label>
            <input
              type="number"
              min="10000"
              onKeyDown={(e) => {
                if (
                  !/^[0-9]$/.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "Delete"
                ) {
                  e.preventDefault();
                }
              }}
              {...register("sumAssured", {
                required: "Required",
                min: { value: 10000, message: "Min 10,000" },
              })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Min 10,000"
            />
            {errors.sumAssured && (
              <span className="text-xs text-red-500">
                {errors.sumAssured.message}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 bg-black text-white font-bold py-2 px-4 rounded-md shadow-sm hover:bg-gray-800 hover:cursor-pointer transition ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Calculating..." : "Generate Quote"}
            </button>
            <button
              type="button"
              onClick={() => {
                reset();
                setResult(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 hover:cursor-pointer"
            >
              Reset
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-8 p-6 bg-gray-100 rounded-lg border border-gray-200 animate-fade-in">
            <h3 className="text-lg font-semibold text-blackmb-4">
              Quotation Summary
            </h3>
            <div className="space-y-2 text-sm text-black">
              <div className="flex justify-between">
                <span>Base Premium:</span>
                <span className="font-mono">
                  RM {result.basePremium.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Risk Loading:</span>
                <span className="font-mono">
                  RM {result.loadingAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Service Tax (6%):</span>
                <span className="font-mono">
                  RM {result.taxAmount.toFixed(2)}
                </span>
              </div>
              <div className="pt-2 border-t border-black flex justify-between text-lg font-bold">
                <span>Annual Rate:</span>
                <span>RM {result.totalPremium.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotationForm;
