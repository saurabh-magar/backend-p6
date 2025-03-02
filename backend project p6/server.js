require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const favicon = require("serve-favicon");

const app = express();
app.use(express.json());

// **Serve Favicon Correctly**
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

// **CORS Configuration (Supports localhost:3000 & localhost:3001)**
const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// **Set Content-Security-Policy (CSP)**
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data: blob: http://localhost:5000 http://localhost:3000 http://localhost:3001; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  );
  next();
});

// **Serve Uploaded Images**
app.use("/uploads", express.static("uploads"));

// **Ensure MongoDB URI Exists**
if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is missing in .env file!");
  process.exit(1);
}

// **Connect to MongoDB**
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// **Default Route for `/`**
app.get("/", (req, res) => {
  res.send("Welcome to the RecipeWala API!");
});

// **Routes**
app.use("/auth", require("./routes/authRoutes"));
app.use("/recipes", require("./routes/recipeRoutes"));

// **Global Error Handling**
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// **Start Server**
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
