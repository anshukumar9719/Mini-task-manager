require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Task = require("./node_modules/Task");

const app = express();

app.use(cors());
app.use(express.json());

// Validate MongoDB IDs before database queries.
function isValidId(id) {
  return mongoose.isValidObjectId(id);
}

// Create a task
app.post("/api/tasks", async (req, res, next) => {
  try {
    const { title } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Title is required and cannot be empty"
      });
    }

    const task = await Task.create({ title: title.trim() });
    return res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

// Get all tasks
app.get("/api/tasks", async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    return res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
});

// Get a task by ID
app.get("/api/tasks/:id", async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json(task);
  } catch (error) {
    next(error);
  }
});

// Update a task title or completion status
app.patch("/api/tasks/:id", async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const allowedFields = ["title", "completed"];
    const fields = Object.keys(req.body);

    if (
      fields.length === 0 ||
      fields.some((field) => !allowedFields.includes(field))
    ) {
      return res.status(400).json({
        message: "Provide title or completed with valid values"
      });
    }

    const updates = {};

    if ("title" in req.body) {
      if (
        typeof req.body.title !== "string" ||
        !req.body.title.trim()
      ) {
        return res.status(400).json({
          message: "Title cannot be empty"
        });
      }

      if (req.body.title.trim().length > 200) {
        return res.status(400).json({
          message: "Title cannot exceed 200 characters"
        });
      }

      updates.title = req.body.title.trim();
    }

    if ("completed" in req.body) {
      if (typeof req.body.completed !== "boolean") {
        return res.status(400).json({
          message: "Completed must be a boolean"
        });
      }

      updates.completed = req.body.completed;
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json(task);
  } catch (error) {
    next(error);
  }
});

// Delete a task
app.delete("/api/tasks/:id", async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// Central error handler
app.use((error, req, res, next) => {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  if (error.name === "ValidationError" ||
      error.name === "CastError") {
    return res.status(400).json({ message: "Invalid task data" });
  }

  return res.status(500).json({
    message: "Internal server error"
  });
});

// Start only after the database connection succeeds
const PORT = process.env.PORT || 5000;

async function startServer() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from .env");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});