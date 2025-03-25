import React, { useEffect, useState } from "react";
import axios from "axios";


const PostsFeed = ({ loggedInUserId }) => {
  const [posts, setPosts] = useState([]);
  const [hoveredPostId, setHoveredPostId] = useState(null); // Track which post is being hovered
  const [showReactions, setShowReactions] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/posts", {
          withCredentials: true,
        });
        setPosts(response.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, []);

  const handleReaction = async (postId, reaction) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/api/posts/${postId}/reactions`,
      { reaction },
      { withCredentials: true }
    );
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? {
              ...post,
              reactions: response.data.reactions,
              userReaction: reaction, // Update the user's reaction
            }
          : post
      )
    );
  } catch (err) {
    console.error("Error updating reaction:", err);
  }
};

  const handleAddComment = async (postId, text) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/posts/${postId}/comments`,
        { text },
        { withCredentials: true }
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, comments: response.data.comments } : post
        )
      );
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const getTotalReactions = (reactions) => {
    return Object.values(reactions).reduce((total, count) => total + count, 0);
  };

  const getReactionEmoji = (reaction) => {
    const emojis = {
      like: "👍",
      love: "❤️",
      haha: "😂",
      wow: "😮",
      sad: "😢",
      angry: "😡",
    };
    return emojis[reaction] || "👍"; // Default to "Like" if no reaction
  };

  const handleMouseEnter = (postId) => {
    setHoveredPostId(postId);
    setTimeout(() => {
      if (hoveredPostId === postId) {
        setShowReactions(true); // Show reactions after a delay
      }
    }, 200); // 200ms delay
  };

  const handleMouseLeave = () => {
    setHoveredPostId(null);
    setShowReactions(false); // Hide reactions immediately
  };

  const handleEditComment = (postId, commentId, currentText) => {
    const newText = prompt("Edit your comment:", currentText);
    if (newText && newText.trim() !== "") {
      axios
        .put(
          `http://localhost:5000/api/posts/${postId}/comments/${commentId}`,
          { text: newText },
          { withCredentials: true }
        )
        .then((response) => {
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post._id === postId
                ? { ...post, comments: response.data.comments }
                : post
            )
          );
        })
        .catch((err) => {
          console.error("Error editing comment:", err);
        });
    }
  };

  const handleDeleteComment = (postId, commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      axios
        .delete(
          `http://localhost:5000/api/posts/${postId}/comments/${commentId}`,
          { withCredentials: true }
        )
        .then((response) => {
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post._id === postId
                ? { ...post, comments: response.data.comments }
                : post
            )
          );
        })
        .catch((err) => {
          console.error("Error deleting comment:", err);
        });
    }
  };

  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id} className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-xl text-gray-500"></i>
              </div>
              <div>
                <p className="font-bold">{post.author}</p>
                <p className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleString()}</p>
              </div>
            </div>
            {post.content && <p className="mb-4">{post.content}</p>}
            {post.media && (
              <img
                src={`http://localhost:5000${post.media}`}
                alt="Post media"
                className="w-full rounded-md mb-4"
              />
            )}
            {post.link && (
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {post.link}
              </a>
            )}
            <div
              className="relative flex items-center space-x-4 mt-4"
              onMouseEnter={() => {setHoveredPostId(post._id); 
                setShowReactions(true); // Show reactions immediately
              }}
              onMouseLeave={() => {setHoveredPostId(null)
                setShowReactions(false); // Hide reactions immediately
              }}
            >
              <button
                onClick={() => handleReaction(post._id, "like")}
                className="text-blue-600 hover:underline"
              >
                {getReactionEmoji(post.userReaction || "like")} React (
                {getTotalReactions(post.reactions)})
              </button>
              {hoveredPostId === post._id && (
                <div className="absolute top-0 left-0 bg-white shadow-lg rounded-md p-2 flex space-x-2 reaction-container">
                  <button
                    onClick={() => handleReaction(post._id, "like")}
                    className="reaction-button text-blue-600"
                  >
                    👍
                  </button>
                  <button
                    onClick={() => handleReaction(post._id, "love")}
                    className="reaction-button text-red-600"
                  >
                    ❤️
                  </button>
                  <button
                    onClick={() => handleReaction(post._id, "haha")}
                    className="reaction-button text-yellow-600"
                  >
                    😂
                  </button>
                  <button
                    onClick={() => handleReaction(post._id, "wow")}
                    className="reaction-button text-orange-600"
                  >
                    😮
                  </button>
                  <button
                    onClick={() => handleReaction(post._id, "sad")}
                    className="reaction-button text-blue-600"
                  >
                    😢
                  </button>
                  <button
                    onClick={() => handleReaction(post._id, "angry")}
                    className="reaction-button text-red-800"
                  >
                    😡
                  </button>
                </div>
              )}
            </div>
            <div className="mt-4">
              <h3 className="font-bold mb-2">Comments</h3>
              {post.comments.map((comment) => {
                console.log("Comment User ID:", comment.userId);
                console.log("Logged In User ID:", loggedInUserId);
                return(
                <div key={comment._id} className="mb-2">
                  <p className="font-bold">{comment.username}</p>
                  <p>{comment.text}</p>
                  {comment.userId === loggedInUserId && ( // Replace `loggedInUserId` with the actual logged-in user's ID
                    <div className="flex space-x-2 mt-1">
                      <button
                        onClick={() => handleEditComment(post._id, comment._id, comment.text)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(post._id, comment._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                );
    })}
              <input
                type="text"
                placeholder="Add a comment..."
                className="w-full p-2 border rounded-md"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddComment(post._id, e.target.value);
                    e.target.value = "";
                  }
                }}
              />
            </div>
          </div>
        ))
      ) : (
        <p>No posts to display.</p>
      )}
    </div>
  );
};

export default PostsFeed;