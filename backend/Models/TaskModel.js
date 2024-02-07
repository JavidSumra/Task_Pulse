const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    taskName: {
      type: String,
      required: [true, "Please provide task title"],
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    description: {
      type: String,
      required: [true, "Please provide description"],
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Low",
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["To-Do", "In Progress", "Completed"],
      default: "To-Do",
      required: true,
    },
    // Later on We'll Change Type of Comments to Ref of Users
    Comments: [
      {
        type: String,
        default: [],
      },
    ],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("Task", taskSchema);
