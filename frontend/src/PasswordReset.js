import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const PasswordReset = () => {
  const { token } = useParams(); // Get the token from the URL
  const navigate = useNavigate(); // Initialize useNavigate
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handlePasswordReset = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/auth/reset-password/${token}`, {
        newPassword,
      });
      setMessage(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Add a 2-second delay before navigating
    } catch (err) {
      console.error("Error during password reset:", err);
      setMessage(err.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Enter your new password"
        className="w-full max-w-md p-2 border rounded-md mb-4"
      />
      <button
        onClick={handlePasswordReset}
        className="bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Reset Password
      </button>
      {message && <p className="mt-4 text-gray-700">{message}</p>}
    </div>
  );
};

export default PasswordReset;