const mongoose = require("mongoose");

const connectDB = async () => {
  const dbURI = process.env.MONGODB_URI;
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
module.exports = connectDB;
