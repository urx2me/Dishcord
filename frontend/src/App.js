import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from "react-router-dom"; // Import Link
import Register from "./Register"; // Import the Register component
import PasswordResetRequest from "./PasswordResetRequest";
import PasswordReset from "./PasswordReset";
import ReactDOM from "react-dom/client";
import CreatePost from "./CreatePost";
import PostsFeed from "./PostsFeed";
import './App.css'
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/auth/login",
        { email, password },
        { withCredentials: true }
      );
      alert("Login successful!");
      console.log("User data:", response.data);
      window.location.href = "/dashboard"; // Redirect to the dashboard
    } catch (err) {
      console.error("Error details:", err);
      if (err.response) {
        alert(`Login failed: ${err.response.data.error}`);
      } else {
        alert("Login failed: Network error.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
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
        onClick={handleLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded-md mb-4"
      >
        Login
      </button>
      <p className="text-gray-700 mb-4">
        <Link to="/password-reset" className="text-blue-600 hover:underline">
          Forgot Password?
        </Link>
      </p>
      <h2 className="text-xl font-bold mb-4">Or</h2>
      <a href="http://localhost:5000/auth/google">
        <button className="bg-green-600 text-white px-4 py-2 rounded-md mb-4">
          Login with Google
        </button>
      </a>
      <p className="text-gray-700">
        Don't have an account?{" "}
        <Link to="/register" className="text-green-600 hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
};

const handlePostCreated = (newPost) => {
  // Optionally, you can refresh the posts feed or update the state
  console.log("New post created:", newPost);
};

// Render the CreatePost component
const createPostRoot = ReactDOM.createRoot(document.getElementById("createPost"));
createPostRoot.render(<CreatePost onPostCreated={handlePostCreated} />);

// Render the PostsFeed component
const postsFeedRoot = ReactDOM.createRoot(document.getElementById("postsSection"));
postsFeedRoot.render(<PostsFeed loggedInUserId={localStorage.getItem("userId")} />);
const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/user", { withCredentials: true })
      .then((res) => {
        setUser(res.data);
        console.log("User data:", res.data); // Debugging log
        document.getElementById("dashboardContent").style.display = "block"; // Show dashboard
        localStorage.setItem("userId", res.data._id); // Store user ID in localStorage
        setLoading(false); // Set loading to false after fetching user data
      })
      .catch((err) => {
        console.log(err);
        document.getElementById("dashboardContent").style.display = "none"; // Hide dashboard
        setLoading(false); // Set loading to false even if there’s an error
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while fetching user data
  }

  return (
    <Router>
      <Routes>
        {!user ? (
          <>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/password-reset" element={<PasswordResetRequest />} />
            <Route path="/reset-password/:token" element={<PasswordReset />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;