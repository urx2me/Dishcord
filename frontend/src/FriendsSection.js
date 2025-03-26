import React, { useEffect, useState } from "react";
import axios from "axios";

const FriendsSection = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [friends, setFriends] = useState([]); // Track the list of friends
  const [sentRequests, setSentRequests] = useState([]); // Track sent friend requests
  const [dropdownVisible, setDropdownVisible] = useState(null); // Track which dropdown is visible
  const [userId, setUserId] = useState(localStorage.getItem("userId")); // Dynamically track the logged-in user's ID

  // Fetch friend requests
  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/friends/friend-requests/${userId}`);
      setFriendRequests(response.data.friendRequests);
    } catch (err) {
      console.error("Error fetching friend requests:", err);
    }
  };

  // Fetch suggested friends
  const fetchSuggestedFriends = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/friends/suggested-friends/${userId}`);
      const validFriends = response.data.suggestedFriends.filter(
        (friend) => friend && friend._id && friend.name
      );
      setSuggestedFriends(validFriends);
    } catch (err) {
      console.error("Error fetching suggested friends:", err);
    }
  };

  // Fetch friends list
  const fetchFriends = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/friends/friends/${userId}`);
      setFriends(response.data.friends);
    } catch (err) {
      console.error("Error fetching friends list:", err);
    }
  };

  // Accept a friend request
  const acceptFriendRequest = async (senderId) => {
    try {
      await axios.post("http://localhost:5000/api/friends/accept-request", {
        userId,
        senderId,
      });
      alert("Friend request accepted!");
      fetchFriendRequests(); // Refresh the friend requests
      fetchSuggestedFriends(); // Refresh the suggested friends
      fetchFriends(); // Refresh the friends list
    } catch (err) {
      console.error("Error accepting friend request:", err);
    }
  };

  // Reject a friend request
  const rejectFriendRequest = async (senderId) => {
    try {
      await axios.post("http://localhost:5000/api/friends/reject-request", {
        userId,
        senderId,
      });
      alert("Friend request rejected!");
      fetchFriendRequests(); // Refresh the friend requests
    } catch (err) {
      console.error("Error rejecting friend request:", err);
    }
  };

  // Send a friend request
  const sendFriendRequest = async (receiverId) => {
    try {
      await axios.post("http://localhost:5000/api/friends/send-request", {
        senderId: userId,
        receiverId,
      });
      alert("Friend request sent!");
      setSentRequests((prev) => [...prev, receiverId]); // Add to sent requests
      fetchSuggestedFriends(); // Refresh the suggested friends
    } catch (err) {
      console.error("Error sending friend request:", err);
    }
  };

  // Cancel a friend request
  const cancelFriendRequest = async (receiverId) => {
    try {
      await axios.post("http://localhost:5000/api/friends/cancel-request", {
        senderId: userId,
        receiverId,
      });
      alert("Friend request cancelled!");
      setSentRequests((prev) => prev.filter((id) => id !== receiverId)); // Remove from sent requests
      fetchSuggestedFriends(); // Refresh the suggested friends
    } catch (err) {
      console.error("Error cancelling friend request:", err);
    }
  };

  // Unfriend a user
  const unfriendUser = async (friendId) => {
    try {
      await axios.post("http://localhost:5000/api/friends/unfriend", {
        userId,
        friendId,
      });
      alert("Unfriended successfully!");
      setDropdownVisible(null); // Hide the dropdown
      fetchFriends(); // Refresh the friends list
    } catch (err) {
      console.error("Error unfriending user:", err);
    }
  };

  // Toggle dropdown visibility
  const toggleDropdown = (friendId) => {
    setDropdownVisible((prev) => (prev === friendId ? null : friendId));
  };

  // Re-fetch data whenever the `userId` changes
  useEffect(() => {
    if (userId) {
      fetchFriendRequests();
      fetchSuggestedFriends();
      fetchFriends();
    }
  }, [userId]);

  // Update the `userId` dynamically when the logged-in user changes
  useEffect(() => {
    const handleStorageChange = () => {
      const newUserId = localStorage.getItem("userId");
      if (newUserId !== userId) {
        setUserId(newUserId); // Update the `userId` state
      }
    };

    window.addEventListener("storage", handleStorageChange); // Listen for changes to localStorage
    return () => {
      window.removeEventListener("storage", handleStorageChange); // Cleanup the event listener
    };
  }, [userId]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {/* Friend Requests Section */}
      {friendRequests.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Friend Requests</h2>
          <ul className="space-y-4">
            {friendRequests.map((request) => (
              <li key={request._id} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <i className="fas fa-user text-xl text-gray-500"></i>
                </div>
                <div>
                  <p className="font-bold">{request.name}</p>
                  <div className="flex space-x-2">
                    <button
                      className="text-green-600"
                      onClick={() => acceptFriendRequest(request._id)}
                    >
                      Accept
                    </button>
                    <button
                      className="text-red-600"
                      onClick={() => rejectFriendRequest(request._id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggested Friends Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">Suggested Friends</h2>
        <ul className="space-y-4">
          {suggestedFriends.map((friend) => (
            <li key={friend._id} className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-xl text-gray-500"></i>
              </div>
              <div>
                <p className="font-bold">{friend.name}</p>
                {sentRequests.includes(friend._id) ? (
                  <button
                    className="text-red-600"
                    onClick={() => cancelFriendRequest(friend._id)}
                  >
                    Cancel Request
                  </button>
                ) : (
                  <button
                    className="text-green-600"
                    onClick={() => sendFriendRequest(friend._id)}
                  >
                    Add Friend
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Friends List Section */}
      {friends.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Your Friends</h2>
          <ul className="space-y-4">
            {friends.map((friend) => (
              <li key={friend._id} className="flex items-center space-x-4 relative">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <i className="fas fa-user text-xl text-gray-500"></i>
                </div>
                <div className="flex-1">
                  <p className="font-bold">{friend.name}</p>
                </div>
                <div>
                  <button
                    className="text-gray-600 hover:text-red-600"
                    onClick={() => toggleDropdown(friend._id)}
                  >
                    <i className="fas fa-ellipsis-h"></i>
                  </button>
                  {dropdownVisible === friend._id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        onClick={() => unfriendUser(friend._id)}
                      >
                        Unfriend
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FriendsSection;