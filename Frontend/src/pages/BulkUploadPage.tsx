import React, { useState } from "react";
import { set, useForm } from "react-hook-form";
import axios from "axios";

const BulkUploadForm = () => {
  const [uploadStatus, setUploadStatus] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setUploadStatus("");
    
    const formData = new FormData();
    formData.append("file", data.csvFile[0]);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/quotations/bulk-upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setUploadStatus("File uploaded successfully! Batch processing started.");
      setResults(response.data);
      reset();
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("Failed to upload file. Check backend logs.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black">Bulk Upload System</h2>
          <p className="text-gray-500 mt-2">
            Upload employee data to generate quotes for corporate groups.
          </p>
        </div>


        <div className="bg-gray-50 border-l-4 border-black p-4 mb-8">
          <h4 className="text-sm font-bold text-black uppercase">
            Required CSV Format:
          </h4>
          <p className="text-xs text-black mt-1">
            Ensure your file has these headers in order:
          </p>
          <code className="block bg-white p-2 mt-2 text-xs rounded border border-black">
            prospectName, gender, age, occupation, smoker, sumAssured
          </code>
          <p className="text-xs text-black mt-2 italic">
            Example: Ali, M, 30, CLASS_1, false, 100000
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              {...register("csvFile", {
                required: "Please select a .csv file",
              })}
              className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-black hover:file:bg-gray-200 border rounded-md p-2 ${
                errors.csvFile ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.csvFile && (
              <span className="text-xs text-red-500 mt-1 block">
                {errors.csvFile.message as string}
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
              {isLoading
                ? "Reading 50 records... calculating premiums..."
                : "Start Bulk Upload"}
            </button>

            <button
              type="button"
              onClick={() => {
                reset();
                setUploadStatus("");
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 hover:cursor-pointer transition"
            >
              Reset
            </button>
          </div>
        </form>

        {uploadStatus && (
          <div
            className={`mt-6 p-4 rounded-md text-sm ${
              uploadStatus.includes("successfully")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {uploadStatus}
          </div>
        )}

        {results && results.length > 0 && (
          <div className="mt-8 overflow-x-auto border-2 border-black">
            <table className="w-full text-left border-collapse font-lightweight">
              <thead>
                <tr className="bg-black text-white">
                  <th className="p-3 border-r border-gray-700">Name</th>
                  <th className="p-3 border-r border-gray-700 text-right">
                    Base
                  </th>
                  <th className="p-3 border-r border-gray-700 text-right">
                    Loading
                  </th>
                  <th className="p-3 border-r border-gray-700 text-right">
                    Tax
                  </th>
                  <th className="p-3 text-right">Annual Rate</th>
                </tr>
              </thead>
              <tbody>
                {results.map((row : any, index) => (
                  <tr
                    key={index}
                    className="border-b border-black hover:bg-gray-50"
                  >
                    <td className="p-3 font-bold uppercase">
                      {row.prospectName}
                    </td>
                    <td className="p-3 text-right font-mono">
                      RM {row.basePremium}
                    </td>
                    <td className="p-3 text-right font-mono text-red-600">
                      +RM {row.loadingAmount}
                    </td>
                    <td className="p-3 text-right font-mono">
                      RM {row.taxAmount}
                    </td>
                    <td className="p-3 text-right font-mono font-bold">
                      RM {row.totalPremium}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 font-black">
                  <td colSpan={4} className="p-3 text-right">
                    TOTAL GROUP PREMIUM:
                  </td>
                  <td className="p-3 text-right underline">
                    RM{" "}
                    {results
                      .reduce((sum, r) => sum + parseFloat(r.totalPremium), 0)
                      .toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkUploadForm;
