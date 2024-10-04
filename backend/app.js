const express = require("express");
const connectDB = require("./config/mongoose-connection");
const commentRoutes = require("./routes/commentRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");  
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");


require('dotenv').config();
// Connect to the database
connectDB();

// Enable CORS with credentials
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Add your frontend URLs here
    credentials: true, // Allow credentials (cookies) to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'], // Specify allowed headers
  })
);

// Initialize cookie parser
app.use(cookieParser());

// Parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize session middleware
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
  })
);

// Set up your routes
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", commentRoutes); // Moved comment routes to a separate line for clarity

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
