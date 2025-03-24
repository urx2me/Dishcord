const isAuthenticated = (req, res, next) => {
    // Check if the user is authenticated using Passport's `isAuthenticated` method
    if (req.isAuthenticated && req.isAuthenticated()) {
      return next(); // User is authenticated, proceed to the next middleware or route handler
    }
  
    // If not authenticated, return an error response
    res.status(401).json({ error: "Unauthorized. Please log in." });
  };
  
  module.exports = { isAuthenticated };