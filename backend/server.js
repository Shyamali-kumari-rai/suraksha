const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const guidesRoutes = require("./routes/guidesRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging in development
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Mount Routes
app.use("/api", guidesRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    app: "Suraksha Offline First-Aid Backend",
    version: "1.0.0",
    guidesCount: 24,
    uptime: process.uptime()
  });
});

// Root friendly response
app.get("/", (req, res) => {
  res.json({
    message: "Suraksha API is running.",
    endpoints: {
      health: "/api/health",
      guides: "/api/guides",
      guideDetail: "/api/guides/:id",
      helplines: "/api/helplines",
      search: "POST /api/search",
      emergencyAlert: "POST /api/emergency-alert"
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`Suraksha Backend Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`===============================================`);
});

module.exports = app;
