const express = require("express");
const connectDb = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();

// Creating an Express server
const app = express();

// Middleware for JSON request parsing
app.use(express.json());

// Middleware for parsing cookies
app.use(cookieParser());

// CORS configuration
const corsOptions = {
    origin: ["http://localhost:5173" , "https://dev-tinder-frontend-delta.vercel.app/"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));

// Handle preflight (OPTIONS) requests explicitly
app.options("*", cors(corsOptions));

// Importing routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestsRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const { config } = require("dotenv");

// Using the routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
app.use("/", userRouter);

// Connect to the database and start the server
connectDb()
    .then(() => {
        console.log("Database connected successfully");
        app.listen(3000, () => {
            console.log("Server is running on port 3000...");
        });
    })
    .catch((err) => {
        console.error("Cannot connect to Database:", err);
        process.exit(1); // Exit process on failure
    });

