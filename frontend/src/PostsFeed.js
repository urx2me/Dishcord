import React, { useEffect, useState } from "react";
import axios from "axios";

const PostsFeed = () => {
  const [posts, setPosts] = useState([]);

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
            {/* Render text content if available */}
            {post.content && <p className="mb-4">{post.content}</p>}
            {/* Render media if available */}
            {post.media && (
              <>
                {post.media.endsWith(".jpg") || post.media.endsWith(".png") || post.media.endsWith(".jpeg") ? (
                  <img
                    src={`http://localhost:5000${post.media}`}
                    alt="Post media"
                    className="w-full rounded-md mb-4"
                  />
                ) : post.media.endsWith(".mp4") ||
                  post.media.endsWith(".webm") ||
                  post.media.endsWith(".ogg") ||
                  post.media.endsWith(".mov") ? ( // Added support for .mov files
                  <video controls className="w-full rounded-md mb-4">
                    <source src={`http://localhost:5000${post.media}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : null}
              </>
            )}
            {/* Render link if available */}
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
          </div>
        ))
      ) : (
        <p>No posts to display.</p>
      )}
    </div>
  );
};

export default PostsFeed;