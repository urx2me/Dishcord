import React, { useState } from "react";
import axios from "axios";

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null); // For image or video uploads
  const [link, setLink] = useState(""); // For links
  const [showLinkInput, setShowLinkInput] = useState(false); // Toggle for link input

  const handleMediaUpload = (e) => {
    setMedia(e.target.files[0]); // Set the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !media && !link.trim()) {
      alert("Post content, media, or link cannot be empty!");
      return;
    }

    const formData = new FormData();
    formData.append("content", content);
    if (media) formData.append("media", media); // Append media if available
    if (link) formData.append("link", link); // Append link if available

    try {
      const response = await axios.post("http://localhost:5000/api/posts", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      });
      alert("Post created successfully!");
      setContent(""); // Clear the input field
      setMedia(null); // Clear the media field
      setLink(""); // Clear the link field
      setShowLinkInput(false); // Reset link input to button
      if (onPostCreated) {
        onPostCreated(response.data); // Notify parent component about the new post
      }
      window.location.reload();
    }
     catch (err) {
      console.error("Error creating post:", err);
      alert("Failed to create post. Please try again.");
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Create Post</h2>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full p-2 border rounded-md mb-4"
        rows="3"
      ></textarea>
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <label className="text-green-600 cursor-pointer">
            <i className="fas fa-image"></i> Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleMediaUpload}
              className="hidden"
            />
          </label>
          <label className="text-green-600 cursor-pointer">
            <i className="fas fa-video"></i> Video
            <input
              type="file"
              accept="video/*"
              onChange={handleMediaUpload}
              className="hidden"
            />
          </label>
          {/* Toggle between button and input for link */}
          {showLinkInput ? (
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Add a link"
              className="w-full max-w-xs p-2 border rounded-md"
              onBlur={() => {
                if (!link.trim()) setShowLinkInput(false); // Revert to button if input is empty
              }}
            />
          ) : (
            <button
              type="button"
              onClick={() => setShowLinkInput(true)}
              className="text-green-600"
            >
              <i className="fas fa-link"></i> Add Link
            </button>
          )}
        </div>
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded-md"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default CreatePost;