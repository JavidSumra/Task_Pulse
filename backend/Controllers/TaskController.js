const mongoose = require("mongoose");
const Task = require("../Models/TaskModel")(mongoose);
const CatchAsyncError = require("../Middleware/CatchAsyncError");
const ErrorHandler = require("../Utils/ErrorHandler");

const createTask = CatchAsyncError(async (req, res, next) => {
  const { title, dueDate, priority, description } = req.body;

  if (!title || !dueDate || !priority || !description) {
    throw new ErrorHandler("Please Provide Values for All Fields", 401);
  }

  const addTask = await Task.create({
    taskName: title,
    dueDate,
    priority,
    description,
  });

  console.log(addTask);

  const isTaskCreated = await Task.findOne({ _id: addTask._id });

  if (isTaskCreated) {
    return res.status(200).json({
      success: true,
      message: "Task Created Successfully",
      data: isTaskCreated,
    });
  } else {
    return res
      .status(501)
      .json({ success: false, error: "Failed to Create Task" });
  }
});

const getAllTasks = CatchAsyncError(async (req, res, next) => {
  const allTasks = await Task.find();

  if (allTasks.length > 0) {
    return res.status(200).json({
      success: true,
      message: "All Tasks Retrieved Successfully",
      data: allTasks,
    });
  } else {
    return res.status(404).json({
      success: false,
      error: "No tasks found",
    });
  }
});

const deleteTask = CatchAsyncError(async (req, res) => {
  // Extracting ID
  const { id } = req.params;

  // Checking For is ID Present
  if (!id) {
    throw new ErrorHandler("Please Provide Valid Id Value", 401);
  }

  // Checking for Existence of Task in DB
  const isTaskExist = await Task.findOne({ _id: id });

  if (isTaskExist) {
    const isDeleted = await Task.findOneAndDelete({ _id: id });

    // Sending Different Response on Base of Status of Deletion
    isDeleted &&
      res.status(200).json({
        success: true,
        message: `Task With Id:${id} Successfully Removed`,
      });

    !isDeleted &&
      res.status(502).json({
        success: false,
        message: `Failed to Remove Task With Id:${id}`,
      });
  } else {
    // If Task Not Exist With Provided ID
    return res.status(402).json({
      success: false,
      message: `No Todo Exist With Provided Id`,
    });
  }
});

const updateTask = CatchAsyncError(async (req, res) => {
  // Extracting ID from Parameter
  const { id } = req.params;
  const { taskName, dueDate, priority, description } = req.body;

  // All Fields Are Required
  if (!taskName || !dueDate || !priority || !description) {
    throw new ErrorHandler("Please Provide Valid Value for Fields", 401);
  }

  if (!id) {
    // Checking For is ID Present
    throw new ErrorHandler("Please Provide Valid Id Value", 401);
  }

  const isTaskExist = await Task.findOne({ _id: id });

  if (isTaskExist) {
    const isUpdate = await Task.findOneAndUpdate(
      { _id: id },
      { taskName, dueDate, priority, description }
    );

    // Sending Different Response on Base of Status of Updating Task
    isUpdate &&
      res.status(200).json({
        success: true,
        message: `Task Successfully Updated With Id:${id}`,
      });

    !isUpdate &&
      res.status(502).json({
        success: false,
        message: `Failed to Update Task With Id:${id}`,
      });
  } else {
    // If Task Not Exist With Provided ID
    return res.status(402).json({
      success: false,
      message: `No Todo Exist With Provided Id`,
    });
  }
});

const updateTaskStatus = CatchAsyncError(async (req, res) => {

    const taskId = req.params.id; 
    const { newStatus } = req.body; 

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { status: newStatus },
      { new: true } 
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task status updated successfully',
      data: updatedTask,
    });
  
  });

module.exports = { createTask, deleteTask, getAllTasks, updateTask , updateTaskStatus};
