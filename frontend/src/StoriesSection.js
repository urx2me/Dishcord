import React, { useState, useEffect } from "react";

const StoriesSection = ({ userId }) => {
  const [userStories, setUserStories] = useState([]); // Array to hold all user stories

  const [showAddStoryModal, setShowAddStoryModal] = useState(false);
  const [storyFile, setStoryFile] = useState(null);
  const [storyTitle, setStoryTitle] = useState("");
  const [selectedStories, setSelectedStories] = useState([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [progress, setProgress] = useState(0); // State for the progress bar
  const [friendStoriesMap, setFriendStoriesMap] = useState({}); // Map of friendId: [stories]
  const [viewingFriendId, setViewingFriendId] = useState(null); // To track whose story is being viewed

  const fetchStories = async () => {
    if (!userId) {
      console.error("User ID is not available");
      return;
    }
    try {
      // Fetch all user's stories
      const userStoryResponse = await fetch(
        `http://localhost:5000/api/stories/user/${userId}`
      );
      const userStoryData = await userStoryResponse.json();
      setUserStories(userStoryData.stories);

      // Fetch friends' stories
      const friendStoriesResponse = await fetch(
        `http://localhost:5000/api/stories/friends/${userId}`
      );
      
      const friendStoriesData = await friendStoriesResponse.json();
      
      // Group friends' stories by userId
      const groupedStories = {};
      friendStoriesData.stories.forEach((story) => {
        if (!groupedStories[story.userId]) {
          groupedStories[story.userId] = [];
        }
        groupedStories[story.userId].push(story);
      });
      setFriendStoriesMap(groupedStories);
      
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [userId]);

  const handleStoryUpload = async () => {
    if (!storyFile || !storyTitle.trim()) {
      alert("Please select a file and add a title.");
      return;
    }

    const formData = new FormData();
    formData.append("file", storyFile);
    formData.append("title", storyTitle);
    formData.append("userId", userId);

    try {
      const response = await fetch("http://localhost:5000/api/stories/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Story uploaded successfully!");
        setShowAddStoryModal(false);
        setStoryFile(null);
        setStoryTitle("");
        fetchStories();
      } else {
        alert("Failed to upload story.");
      }
    } catch (error) {
      console.error("Error uploading story:", error);
    }
  };

  const handleStoryClick = (clickedUserId, stories) => {
    console.log("Story clicked for userId:", clickedUserId);
    console.log("friendStoriesMap:", friendStoriesMap);
    setSelectedStories(stories);
    setCurrentStoryIndex(0);
    setShowStoryViewer(true);
    setProgress(0); // Reset progress
    setViewingFriendId(clickedUserId); // Add this line
  };

  useEffect(() => {
    let interval;
    if (showStoryViewer && selectedStories.length > 0) {
      setProgress(0);
      const duration = 5000;
      const step = 100;
      let progressCounter = 0;

      const updateProgress = () => {
        progressCounter += step;
        setProgress((progressCounter / duration) * 100);
      };

      interval = setInterval(() => {
        updateProgress();
        if (progressCounter >= duration) {
          setCurrentStoryIndex((prevIndex) =>
            prevIndex === selectedStories.length - 1 ? -1 : prevIndex + 1
          );
          progressCounter = 0;
          setProgress(0);
        }
      }, step);
    } else {
      clearInterval(interval);
    }

    // After viewing all stories of a friend, close the viewer
    if (showStoryViewer && currentStoryIndex === -1) {
        setShowStoryViewer(false);
        setViewingFriendId(null); // Add this line
      }
  
      return () => clearInterval(interval);
    }, [showStoryViewer, selectedStories, currentStoryIndex]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Stories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {/* Add Story */}
        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={() => setShowAddStoryModal(true)}
        >
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
            <i className="fas fa-plus text-3xl text-gray-500"></i>
          </div>
          <p className="text-center text-sm mt-2">Add Story</p>
        </div>

        {/* User's Story Circle */}
        {userStories && userStories.length > 0 && (
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => handleStoryClick(userId, userStories)}
          >
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
              <img
                src={`http://localhost:5000${userStories[userStories.length - 1]?.fileUrl?.startsWith('/uploads/stories/') ? userStories[userStories.length - 1]?.fileUrl : '/uploads/stories/' + userStories[userStories.length - 1]?.fileUrl}`}
                alt={userStories[userStories.length - 1]?.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error("Error loading image:", userStories[userStories.length - 1]?.fileUrl);
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
            </div>
            <p className="text-center text-sm mt-2">Your Story</p>
          </div>
        )}

        {/* Friends' Stories */}
        {Object.entries(friendStoriesMap).map(([friendId, stories]) => (
          <div
            key={friendId}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => handleStoryClick(friendId, stories)}
          >
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
              <img
                src={`http://localhost:5000${stories[stories.length - 1]?.fileUrl?.startsWith('/uploads/stories/') ? stories[stories.length - 1]?.fileUrl : '/uploads/stories/' + stories[stories.length - 1]?.fileUrl}`}
                alt={stories[stories.length - 1]?.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error("Error loading image:", stories[stories.length - 1]?.fileUrl);
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
            </div>
            <p className="text-center text-sm mt-2">{stories[0]?.name || 'Unknown'}</p>
          </div>
        ))}
      </div>

      {/* Add Story Modal */}
      {showAddStoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add Story</h2>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setStoryFile(e.target.files[0])}
              className="mb-4"
            />
            <input
              type="text"
              placeholder="Story Title"
              value={storyTitle}
              onChange={(e) => setStoryTitle(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                onClick={() => setShowAddStoryModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md"
                onClick={handleStoryUpload}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Story Viewer */}
      {showStoryViewer && selectedStories.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-4">
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div
                className="bg-blue-500 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <img
              src={`http://localhost:5000${selectedStories[currentStoryIndex]?.fileUrl?.startsWith('/uploads/stories/') ? selectedStories[currentStoryIndex]?.fileUrl : '/uploads/stories/' + selectedStories[currentStoryIndex]?.fileUrl}`}
              alt={selectedStories[currentStoryIndex]?.title}
              className="w-full max-h-[80vh] object-contain rounded-lg mb-2"
              onError={(e) => {
                console.error(
                  "Error loading story image:",
                  selectedStories[currentStoryIndex]?.fileUrl
                );
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/300";
              }}
            />
            <p className="text-center text-lg font-bold mb-2">
              {selectedStories[currentStoryIndex]?.title}
            </p>
            <div className="flex justify-between items-center">
              <button
                className="bg-gray-300 text-gray-700 px-3 py-1 rounded-md"
                onClick={() => setShowStoryViewer(false)}
              >
                Close
              </button>
              {selectedStories.length > 1 && (
                <div>
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2"
                    onClick={() =>
                      setCurrentStoryIndex((prev) =>
                        prev > 0 ? prev - 1 : selectedStories.length - 1
                      )
                    }
                  >
                    Previous
                  </button>
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded-md"
                    onClick={() =>
                      setCurrentStoryIndex((prev) =>
                        prev < selectedStories.length - 1 ? prev + 1 : 0
                      )
                    }
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoriesSection;