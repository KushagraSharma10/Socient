const express = require("express");
const connectDB = require("./config/mongoose-connection");
const commentRoutes = require("./routes/commentRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");

app.use(cors());
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
  })
);

app.use("/api/posts/", commentRoutes);
app.use("/api/users/", userRoutes);
app.use("/api/posts/", postRoutes);

app.listen(3000);
