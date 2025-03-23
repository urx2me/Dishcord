import React, { useState } from "react";
import axios from "axios";

const PasswordResetRequest = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handlePasswordResetRequest = async () => {
    try {
      const response = await axios.post("http://localhost:5000/auth/password-reset", { email });
      setMessage(response.data.message);
    } catch (err) {
      console.error("Error during password reset request:", err);
      setMessage(err.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Password Reset</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="w-full max-w-md p-2 border rounded-md mb-4"
      />
      <button
        onClick={handlePasswordResetRequest}
        className="bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Send Reset Link
      </button>
      {message && <p className="mt-4 text-gray-700">{message}</p>}
    </div>
  );
};

export default PasswordResetRequest;