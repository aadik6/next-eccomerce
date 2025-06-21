require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");

const app = express();
connectDB(); 
// Middleware to handle CORS 
app.use(
  cors({
    origin: "http://localhost:3000", // must match your frontend exactly
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const port = process.env.PORT || 8080;

app.use("/api/auth", require("./routes/authRoute"));






app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
