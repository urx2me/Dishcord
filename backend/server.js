const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require("express-session"); // ✅ Replacing cookie-session
const passport = require("passport");
const cors = require("cors");
const router = express.Router();

require("./config/passportSetup");

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Use express-session instead of cookie-session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      secure: false, // Set to true if using HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// Initialize passport authentication
app.use(passport.initialize());
app.use(passport.session());

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Routes
app.use("/auth", require("./routes/authRoutes")); // ✅ Ensure correct path
app.use("/api/posts", require("./routes/postRoutes")); // Register the post routes
app.use("/api/friends", require("./routes/friendsRoutes")); // Register the friends routes

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

app.use("/uploads", express.static("uploads"));

