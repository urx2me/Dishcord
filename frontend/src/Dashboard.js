import React from "react";

const Dashboard = () => {
  return (
    <div>
    <header class="bg-white shadow-md">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <div class="text-2xl font-bold text-green-600">Dishcord</div>
        <nav class="flex space-x-4">
            <a class="text-gray-700 hover:text-green-600" href="index.html">Home</a>
            <a class="text-gray-700 hover:text-green-600" href="explore.html">Explore</a>
            <a class="text-gray-700 hover:text-green-600" href="recipes.html">Recipes</a>
            <a class="text-gray-700 hover:text-green-600" href="community.html">Community</a>
        </nav>
        <div class="flex items-center space-x-4">
            <div class="relative">
                <input id="searchInput" class="px-4 py-2 border rounded-md pl-10" placeholder="Search..." type="text"/>
                <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" onclick="search()"></i>
            </div>
            <div class="relative">
                <button class="text-gray-700 hover:text-green-600 focus:outline-none" onclick="toggleDropdown()">
                    <i class="fas fa-bars text-2xl"></i>
                </button>
                <div id="dropdownMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden">
                    <a class="block px-4 py-2 text-gray-700 hover:bg-gray-100" href="profile.html">
                        <i class="fas fa-user-circle mr-2"></i> Profile
                    </a>
                    <a class="block px-4 py-2 text-gray-700 hover:bg-gray-100" href="video.html">
                        <i class="fas fa-video mr-2"></i> Video
                    </a>
                    <a class="block px-4 py-2 text-gray-700 hover:bg-gray-100" href="ai.html">
                        <i class="fas fa-robot mr-2"></i> AI
                    </a>
                    <a class="block px-4 py-2 text-gray-700 hover:bg-gray-100" href="messages.html">
                        <i class="fas fa-envelope mr-2"></i> Messages
                    </a>
                    <a class="block px-4 py-2 text-gray-700 hover:bg-gray-100" href="signup.html">
                        <i class="fas fa-user-plus mr-2"></i> Join Us
                    </a>
                    <hr class="my-2 border-gray-200" />
                    <button
                        class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onclick="logout()"
                    >
                        <i class="fas fa-sign-out-alt mr-2"></i> Logout
                    </button>
                </div>
            </div>
        </div>
    </div>
</header>
<section class="container mx-auto px-4 py-4">
    <div class="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 class="text-xl font-bold mb-4">Stories</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            <div class="flex flex-col items-center">
                <div class="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                    <i class="fas fa-user text-3xl text-gray-500"></i>
                </div>
                <p class="text-center text-sm mt-2">John Doe</p>
            </div>
            <div class="flex flex-col items-center">
                <div class="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                    <i class="fas fa-user text-3xl text-gray-500"></i>
                </div>
                <p class="text-center text-sm mt-2">Jane Smith</p>
            </div>
            <div class="flex flex-col items-center">
                <div class="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                    <i class="fas fa-user text-3xl text-gray-500"></i>
                </div>
                <p class="text-center text-sm mt-2">Alice Johnson</p>
            </div>
            <div class="flex flex-col items-center">
                <div class="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                    <i class="fas fa-user text-3xl text-gray-500"></i>
                </div>
                <p class="text-center text-sm mt-2">Bob Brown</p>
            </div>
            <div class="flex flex-col items-center">
                <div class="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                    <i class="fas fa-user text-3xl text-gray-500"></i>
                </div>
                <p class="text-center text-sm mt-2">Charlie Davis</p>
            </div>
            <div class="flex flex-col items-center">
                <div class="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                    <i class="fas fa-user text-3xl text-gray-500"></i>
                </div>
                <p class="text-center text-sm mt-2">Emily White</p>
            </div>
            <div class="flex flex-col items-center">
                <div class="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                    <i class="fas fa-user text-3xl text-gray-500"></i>
                </div>
                <p class="text-center text-sm mt-2">Michael Green</p>
            </div>
            <div class="flex flex-col items-center">
                <div class="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                    <i class="fas fa-user text-3xl text-gray-500"></i>
                </div>
                <p class="text-center text-sm mt-2">Sarah Blue</p>
            </div>
        </div>
    </div>
</section>
<main class="container mx-auto px-4 py-4 flex space-x-6">
    <aside class="w-1/4 hidden lg:block">
        <div class="bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 class="text-xl font-bold mb-4">Trending Hashtags</h2>
            <ul class="space-y-2">
                <li><a class="text-green-600" href="#">#Foodie</a></li>
                <li><a class="text-green-600" href="#">#Delicious</a></li>
                <li><a class="text-green-600" href="#">#Yummy</a></li>
                <li><a class="text-green-600" href="#">#Healthy</a></li>
                <li><a class="text-green-600" href="#">#Recipe</a></li>
            </ul>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-md">
            <h2 class="text-xl font-bold mb-4">Suggested Friends</h2>
            <ul class="space-y-4">
                <li class="flex items-center space-x-4">
                    <div class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <i class="fas fa-user text-xl text-gray-500"></i>
                    </div>
                    <div>
                        <p class="font-bold">John Doe</p>
                        <button class="text-green-600 follow-btn" onclick="toggleFollow(this)">Follow</button>
                    </div>
                </li>
                <li class="flex items-center space-x-4">
                    <div class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <i class="fas fa-user text-xl text-gray-500"></i>
                    </div>
                    <div>
                        <p class="font-bold">Jane Smith</p>
                        <button class="text-green-600 follow-btn" onclick="toggleFollow(this)">Follow</button>
                    </div>
                </li>
                <li class="flex items-center space-x-4">
                    <div class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <i class="fas fa-user text-xl text-gray-500"></i>
                    </div>
                    <div>
                        <p class="font-bold">Alice Johnson</p>
                        <button class="text-green-600 follow-btn" onclick="toggleFollow(this)">Follow</button>
                    </div>
                </li>
            </ul>
        </div>
    </aside>
    <section class="w-full lg:w-2/4">
    
        <div id="createPost"></div>
        <div id="postsSection"></div>
      </section>
    <aside class="w-1/4 hidden lg:block">
        <div class="bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 class="text-xl font-bold mb-4">Notifications</h2>
            <ul class="space-y-4">
                <li class="flex items-center space-x-4">
                    <div class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <i class="fas fa-user text-xl text-gray-500"></i>
                    </div>
                    <div>
                        <p><span class="font-bold">Alice Johnson</span> liked your post.</p>
                        <p class="text-gray-500 text-sm">1 hour ago</p>
                    </div>
                </li>
                <li class="flex items-center space-x-4">
                    <div class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <i class="fas fa-user text-xl text-gray-500"></i>
                    </div>
                    <div>
                        <p><span class="font-bold">Bob Brown</span> commented on your post.</p>
                        <p class="text-gray-500 text-sm">3 hours ago</p>
                    </div>
                </li>
                <li class="flex items-center space-x-4">
                    <div class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <i class="fas fa-user text-xl text-gray-500"></i>
                    </div>
                    <div>
                        <p><span class="font-bold">Charlie Davis</span> started following you.</p>
                        <p class="text-gray-500 text-sm">5 hours ago</p>
                    </div>
                </li>
            </ul>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 class="text-xl font-bold mb-4">Live Cooking Rooms</h2>
            <ul class="space-y-4">
                <li class="flex items-center space-x-4">
                    <div class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <i class="fas fa-utensils text-xl text-gray-500"></i>
                    </div>
                    <div>
                        <p class="font-bold">Italian Cooking</p>
                        <p class="text-gray-500 text-sm">Live now</p>
                    </div>
                </li>
                <li class="flex items-center space-x-4">
                    <div class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <i class="fas fa-utensils text-xl text-gray-500"></i>
                    </div>
                    <div>
                        <p class="font-bold">Vegan Delights</p>
                        <p class="text-gray-500 text-sm">Live now</p>
                    </div>
                </li>
                <li class="flex items-center space-x-4">
                    <div class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <i class="fas fa-utensils text-xl text-gray-500"></i>
                    </div>
                    <div>
                        <p class="font-bold">Baking Basics</p>
                        <p class="text-gray-500 text-sm">Live now</p>
                    </div>
                </li>
            </ul>
        </div>
    </aside>
</main>
</div>
  );
};

export default Dashboard;