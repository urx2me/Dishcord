import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post(
        "http://localhost:5000/auth/register",
        { email, password },
        { withCredentials: true } // Include credentials for session handling
      );
      alert("Registration successful!");
      navigate("/login"); // Redirect to the login page
    } catch (err) {
      console.error("Error details:", err);
      if (err.response) {
        alert(`Registration failed: ${err.response.data.error}`);
      } else {
        alert("Registration failed: Network error.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full max-w-md p-2 border rounded-md mb-4"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full max-w-md p-2 border rounded-md mb-4"
      />
      <button
        onClick={handleRegister}
        className="bg-green-600 text-white px-4 py-2 rounded-md"
      >
        Register
      </button>
    </div>
  );
};

export default Register;