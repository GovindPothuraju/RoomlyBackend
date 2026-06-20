require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const initializeSocket  = require("./config/socketManager");
const PORT = process.env.PORT || 3000;
const app = express();



// get routers
const userRouter = require("./routers/userRouter");
const meetingRouter = require("./routers/meetingRouter");

app.use(cors({
  origin: [
    "http://localhost:5174",
    "https://roomly-frontend-delta.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// user routs
app.use("/api/v1/user",userRouter);
app.use("/api/v1",meetingRouter);




app.get("/healthz", (req, res) => {
    res.status(200).json({
        status: "ok",
    });
});

const server = http.createServer(app);
initializeSocket(server);
connectDB()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
    });