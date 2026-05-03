import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../services/api";

const Home = () => {
  const [recentQuotes, setRecentQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/quotations/recent-quotes")
      .then((res) => {
          setRecentQuotes(res.data.quotations || []);
      })
      .catch((err) => {
        console.error("Error fetching quotes:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Insurance Agent Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-black cursor-pointer transition">
          <h2 className="text-lg font-semibold text-black">
            Individual Quotation
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Generate a personalized price for a single prospect.
          </p>
          <Link
            to="/new-quote"
            className="mt-4 inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            New Quote
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-black cursor-pointer transition">
          <h2 className="text-lg font-semibold text-black">Bulk Processing</h2>
          <p className="text-gray-500 text-sm mt-2">
            Upload a CSV file to calculate premiums for multiple employees.
          </p>

          <Link
            to="/bulk-upload"
            className="mt-4 inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 cursor-pointer transition"
          >
            Bulk Upload
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-gray-700 font-bold mb-4">Recent Calculations</h3>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-md"></div>
            ))}
            <p className="text-center text-gray-400 text-sm">
              Fetching latest quotes...
            </p>
          </div>
        ) : recentQuotes.length === 0 ? (
          <div className="text-gray-400 italic text-center py-10">
            No recent activity found. Start by creating a new quote.
          </div>
        ) : (
          <div className="space-y-4">
            {recentQuotes.map((quote: any) => (
              <div
                key={quote.prospectName}
                className="flex justify-between items-center p-3 hover:bg-gray-50 transition-colors rounded-md border-b last:border-0"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {quote.prospectName}
                  </p>
                  <p className="text-xs text-gray-500">{quote.createdAt}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-black">
                    RM {quote.totalPremium.toFixed(2)}
                  </p>
                  <span
                    className={`text-[10px] px-2 py-1 rounded-full uppercase ${
                      quote.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {quote.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
