import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

function MessagesPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSearch = () => {
    const searchTerm = searchInputRef.current.value;
    if (searchTerm) {
      alert(`Searching for: ${searchTerm}`);
    } else {
      alert('Please enter a search term.');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && event.target !== document.querySelector('.fa-bars')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="bg-gray-100 text-gray-800 h-screen flex flex-col">
      <header className="bg-white shadow-md w-full">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-green-600">Dishcord</div>
          <nav className="flex space-x-4">
            <Link className="text-gray-800 hover:text-green-600" to="/">Home</Link>
            <Link className="text-gray-800 hover:text-green-600" to="/explore">Explore</Link>
            <Link className="text-gray-800 hover:text-green-600" to="/recipes">Recipes</Link>
            <Link className="text-gray-800 hover:text-green-600" to="/community">Community</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                ref={searchInputRef}
                id="searchInput"
                className="px-4 py-2 border rounded-md pl-10 bg-gray-200 text-gray-800"
                placeholder="Search..."
                type="text"
              />
              <i
                className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={handleSearch}
              ></i>
            </div>
            <div className="relative">
              <button
                className="text-gray-800 hover:text-green-600 focus:outline-none"
                onClick={toggleDropdown}
              >
                <i className="fas fa-bars text-2xl"></i>
              </button>
              <div
                ref={dropdownRef}
                id="dropdownMenu"
                className={`absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg ${isDropdownOpen ? '' : 'hidden'}`}
              >
                <Link className="block px-4 py-2 text-gray-300 hover:bg-gray-700" to="/profile">
                  <i className="fas fa-user-circle mr-2"></i> Profile
                </Link>
                <Link className="block px-4 py-2 text-gray-300 hover:bg-gray-700" to="/video">
                  <i className="fas fa-video mr-2"></i> Video
                </Link>
                <Link className="block px-4 py-2 text-gray-300 hover:bg-gray-700" to="/ai">
                  <i className="fas fa-robot mr-2"></i> AI
                </Link>
                <Link className="block px-4 py-2 text-gray-300 hover:bg-gray-700" to="/messages">
                  <i className="fas fa-envelope mr-2"></i> Messages
                </Link>
                <Link className="block px-4 py-2 text-gray-300 hover:bg-gray-700" to="/signup">
                  <i className="fas fa-user-plus mr-2"></i> Join Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="bg-white w-20 sm:w-24 md:w-28 lg:w-32 xl:w-36 flex flex-col items-center py-4 space-y-4 border-r border-gray-300">
          <div className="w-full flex justify-center">
            <img
              alt="Discord Logo"
              className="rounded-full"
              height="40"
              src="https://storage.googleapis.com/a1aa/image/3VZe0u5Ou3bXIKmkbFxm267XIYAt2fwiv2Qlwniz2H8.jpg"
              width="40"
            />
          </div>
          <div className="w-full flex flex-col items-center space-y-4">
            <img
              alt="Server Icon"
              className="rounded-full"
              height="40"
              src="https://storage.googleapis.com/a1aa/image/77Je5XKhYeZzSGiTPbOrIKDR0RmjmbAdKA2cmi2yCo8.jpg"
              width="40"
            />
            <img alt="Server Icon" className="rounded-full" height="40" src="https://placehold.co/50x50" width="40" />
            <img alt="Server Icon" className="rounded-full" height="40" src="https://placehold.co/50x50" width="40" />
            <img alt="Server Icon" className="rounded-full" height="40" src="https://placehold.co/50x50" width="40" />
            <img alt="Server Icon" className="rounded-full" height="40" src="https://placehold.co/50x50" width="40" />
            <img alt="Server Icon" className="rounded-full" height="40" src="https://placehold.co/50x50" width="40" />
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="bg-gray-200 flex items-center justify-between px-4 py-2 border-b border-gray-300">
            <div className="flex items-center space-x-2">
              <i className="fas fa-hashtag text-xl"></i>
              <span className="text-lg font-semibold">10mb Gang</span>
            </div>
            <div className="flex items-center space-x-4">
              <i className="fas fa-phone-alt"></i>
              <i className="fas fa-video"></i>
              <i className="fas fa-thumbtack"></i>
              <i className="fas fa-user-plus"></i>
              <input
                className="bg-gray-200 text-gray-800 px-2 py-1 rounded"
                placeholder="Search"
                type="text"
              />
              <i className="fas fa-question-circle"></i>
              <i className="fas fa-inbox"></i>
              <i className="fas fa-cog"></i>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            <div className="bg-white w-64 flex flex-col p-4 space-y-4 border-r border-gray-300">
              <input
                className="bg-gray-200 text-gray-800 px-2 py-1 rounded"
                placeholder="Find or start a conversation"
                type="text"
              />
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-user-friends"></i>
                  <span>Friends</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-envelope"></i>
                  <span>Message Requests</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-crown"></i>
                  <span>Dishtro</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-shopping-cart"></i>
                  <span>Shop</span>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <span className="text-gray-400">PLAY AGAIN</span>
                <div className="flex items-center space-x-2">
                  <i className="fab fa-youtube"></i>
                  <span>YouTube</span>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <span className="text-gray-400">DIRECT MESSAGES</span>
                <div className="flex items-center space-x-2">
                  <img
                    alt="User Icon"
                    className="rounded-full w-8 h-8"
                    height="40"
                    src="https://placehold.co/50x50"
                    width="40"
                  />
                  <span>User 1</span>
                </div>
                <div className="flex items-center space-x-2">
                  <img
                    alt="User Icon"
                    className="rounded-full w-8 h-8"
                    height="40"
                    src="https://placehold.co/50x50"
                    width="40"
                  />
                  <span>User 2</span>
                </div>
                <div className="flex items-center space-x-2">
                  <img
                    alt="User Icon"
                    className="rounded-full w-8 h-8"
                    height="40"
                    src="https://placehold.co/50x50"
                    width="40"
                  />
                  <span>User 3</span>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="flex items-start space-x-4">
                  <img
                    alt="User Icon"
                    className="rounded-full w-10 h-10"
                    height="40"
                    src="https://placehold.co/50x50"
                    width="40"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">User 1</span>
                      <span className="text-gray-400 text-sm">31/08/2023 9:39 pm</span>
                    </div>
                    <p>Hello everyone! How's it going?</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <img
                    alt="User Icon"
                    className="rounded-full w-10 h-10"
                    height="40"
                    src="https://placehold.co/50x50"
                    width="40"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">User 2</span>
                      <span className="text-gray-400 text-sm">31/08/2023 9:40 pm</span>
                    </div>
                    <p>I'm doing great! Just finished a project.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <img
                    alt="User Icon"
                    className="rounded-full w-10 h-10"
                    height="40"
                    src="https://placehold.co/50x50"
                    width="40"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">User 3</span>
                      <span className="text-gray-400 text-sm">31/08/2023 9:41 pm</span>
                    </div>
                    <p>What project are you working on?</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <img
                    alt="User Icon"
                    className="rounded-full w-10 h-10"
                    height="40"
                    src="https://placehold.co/50x50"
                    width="40"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">User 1</span>
                      <span className="text-gray-400 text-sm">31/08/2023 9:42 pm</span>
                    </div>
                    <p>Just a small web app for tracking tasks.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <img
                    alt="User Icon"
                    className="rounded-full w-10 h-10"
                    height="40"
                    src="https://placehold.co/50x50"
                    width="40"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">User 2</span>
                      <span className="text-gray-400 text-sm">31/08/2023 9:43 pm</span>
                    </div>
                    <p>Sounds interesting! Let me know if you need help.</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-200 p-4 flex items-center space-x-4">
                <input
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded flex-1"
                  placeholder="Message 10mb Gang"
                  type="text"
                />
                <i className="fas fa-gift"></i>
                <i className="fas fa-image"></i>
                <i className="fas fa-smile"></i>
                <i className="fas fa-plus-circle"></i>
              </div>
            </div>

            <div className="bg-white w-64 flex flex-col p-4 space-y-4 border-l border-gray-300">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold">MEMBERS—5</span>
              </div>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <img
                    alt="User Icon"
                    className="rounded-full w-8 h-8"
                    height="40"
                    src="https://placehold.co/50x50"
                    width="40"
                  />
                  <span>User 1</span>
                </div>
                <div className="flex items-center space-x-2">
                  <img
                    alt="User Icon"
                    className="rounded-full w-8 h-8"
                    height="40"
                    src="https://placehold.co/50x50"
                    width="40"
                  />
                  <span>User 2</span>
                </div>
                <div className="flex items-center space-x-2">
                  <img
                    alt="User Icon"
                    className="rounded-full w-8 h-8"
                    height="40"
                    src="https://placehold.co/50x50"
                    width="40"
                  />
                  <span>User 3</span>
                </div>
                <div className="flex items-center space-x-2">
                  <img
                    alt="User Icon"
                    className="rounded-full w-8 h-8"
                    height="40"
                    src="https://placehold.co/50x50"
                    width="40"
                  />
                  <span>User 4</span>
                </div>
                <div className="flex items-center space-x-2">
                  <img
                    alt="User Icon"
                    className="rounded-full w-8 h-8"
                    height="40"
                    src="https://placehold.co/50x50"
                    width="40"
                  />
                  <span>User 5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessagesPage;