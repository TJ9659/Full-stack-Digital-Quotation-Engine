import React, { useState, useEffect } from "react";
import axios from "axios";

interface QuotationData {
  quotations: any[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
}

const HistoryPage = () => {
  const [data, setData] = useState<QuotationData>({ 
    quotations: [], 
    currentPage: 0, 
    totalPages: 0, 
    totalElements: 0 
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const pageSize = 10;

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:8080/api/quotations/history?page=${currentPage}&size=${pageSize}`,
        );
        console.log(res.data);
        setData(res.data);
      } catch (err) {
        console.error("Error fetching history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [currentPage]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Quotation History</h2>

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white border-b border-gray-200">
              <tr className="text-gray-500 text-[11px] uppercase tracking-wider">
                <th className="p-4 font-semibold border-l border-white text-gray-800">Prospect</th>
                <th className="p-4 font-semibold border-l border-white text-center">Profile (G/A/S)</th>
                <th className="p-4 font-semibold border-l border-white text-center">Occupation Class</th>
                <th className="p-4 font-semibold border-l border-white text-right">Base / Load / Tax</th>
                <th className="p-4 font-semibold border-l border-white text-right text-gray-800">Total Premium</th>
                <th className="p-4 font-semibold border-l border-white text-center">Status</th>
                <th className="p-4 font-semibold border-l border-white">Date</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-gray-400">Loading records...</td>
                </tr>
              ) : data.quotations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-20 text-center text-gray-400 italic">No quotations found.</td>
                </tr>
              ) : (
                data.quotations.map((q: any) => (
                  <tr key={q.prospectName} className="border-b hover:bg-gray-50 transition">
                    <td className="p-4 font-semibold text-gray-900">{q.prospectName}</td>
                    

                    <td className="p-4 text-center text-gray-600">
                      <span className="capitalize">{q.gender.toLowerCase()}</span> • {q.age} • 
                      <span className={q.isSmoker ? "text-red-500 font-medium" : "text-green-600"}>
                        {q.isSmoker ? " Smoker" : " Non-Smoker"}
                      </span>
                    </td>

                    <td className="p-4 text-center font-semibold text-gray-900">{q.occupation.split("_").join(" ")}</td>


                    <td className="p-4 text-right text-gray-500 text-xs tabular-nums">
                      RM{q.basePremium.toFixed(2)} / RM{q.loadingAmount.toFixed(2)} / RM{q.taxAmount.toFixed(2)}
                    </td>

                    <td className="p-4 text-right text-blue-700 font-bold">
                      RM {q.totalPremium.toFixed(2)}
                    </td>

                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                        q.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 text-xs">{q.createdAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 flex items-center justify-between bg-gray-50 border-t">
          <div className="text-sm text-gray-500">
            Total Results: <strong>{data.totalElements}</strong>
          </div>

          <div className="flex items-center gap-4">
            <button
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 border rounded bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-100 transition-colors"
            >
              Previous
            </button>

            <span className="text-sm text-gray-600">
              Page <strong>{currentPage + 1}</strong> of <strong>{data.totalPages || 1}</strong>
            </span>

            <button
              disabled={currentPage + 1 >= data.totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 border rounded bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-100 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;