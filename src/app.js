const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const passport = require("./config/passport");
const { rateLimiter } = require("./middleware/newRateLimiter");

require("dotenv").config();

const authRoutes = require("./routes/auth");
const notesRoutes = require("./routes/notes");

const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://atens-notes-app.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:5174",
      "http://127.0.0.1:5173",
    ];

    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("Blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Length", "X-Request-Id"],
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

app.get("/api", (req, res) => {
  res.json({
    message: "Notes App API is running!",
    environment: process.env.NODE_ENV,
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    frontend: process.env.FRONTEND_URL,
  });
});

app.get("/", (req, res) => {
  res.json({
    message: "Notes App API",
    status: "running",
  });
});

app.get("/api/db-test", async (req, res) => {
  try {
    const { prisma } = require("./config/database");
    const userCount = await prisma.user.count();
    const noteCount = await prisma.note.count();

    res.json({
      message: "Database connection successful",
      stats: {
        users: userCount,
        notes: noteCount,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Database connection failed", details: error.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

module.exports = app;
