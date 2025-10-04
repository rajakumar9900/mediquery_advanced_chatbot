import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  email: string;
  exp: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [reportCount, setReportCount] = useState(0);   

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirect to login if not authenticated
    } else {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        setUserEmail(decoded.email);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  }, [navigate]);

  // Load report count
  useEffect(() => {
    // For now, just set a default value
    setReportCount(0);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-indigo-700">
          MediQuery Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Welcome Card */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">Welcome 👋</h2>
          <p className="text-gray-600">
            {userEmail ? `Logged in as: ${userEmail}` : "Loading..."}
          </p>
        </div>

        {/* Chatbot Access */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">Chat with MediQuery</h2>
          <p className="text-gray-600 mb-4">
            Access your AI medical assistant and ask questions.
          </p>
          <button
            onClick={() => navigate("/chat")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Open Chatbot
          </button>
        </div>

        {/* Profile Section */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">Profile</h2>
          <p className="text-gray-600">Manage your account settings here.</p>
          <button className="mt-3 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800">
            Edit Profile
          </button>
        </div>

        {/* Reports & History card */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">Reports & History</h2>
          <p className="text-gray-600 mb-2">
            View your medical queries history and manage reports.
          </p>
          <p className="text-sm text-gray-500 mb-3">
            You have {reportCount} recent reports
          </p>
          
          {/* Navigation Buttons */}
          <div className="space-y-2 mb-4">
            <button
              onClick={() => navigate("/history")}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              View Chat History
            </button>
            <button
              onClick={() => {
                // Future: Navigate to reports page
                alert("Reports feature coming soon!");
              }}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              View Reports
            </button>
          </div>

          {/* Report Insertion Options */}
          <div className="mb-4 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Insert New Report</h3>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => {
                  console.log("Create Medical Report button clicked");
                  alert("Medical report creation feature coming soon!");
                }}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                📋 Create Medical Report
              </button>
              <button
                onClick={() => {
                  console.log("Upload Document button clicked");
                  alert("Document upload feature coming soon!");
                }}
                className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                📤 Upload Document
              </button>
              <button
                onClick={() => {
                  console.log("Import from File button clicked");
                  alert("File import feature coming soon!");
                }}
                className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
              >
                📁 Import from File
              </button>
            </div>
          </div>

          {/* Document Export Section */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Export Documents</h3>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => {
                  console.log("Download PDF");
                  alert("PDF download feature coming soon!");
                }}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                📄 Download PDF
              </button>
              <button
                onClick={() => {
                  console.log("Download DOCX");
                  alert("DOCX download feature coming soon!");
                }}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                📝 Download DOCX
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
