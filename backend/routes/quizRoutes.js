const express = require("express");
const Quiz = require("../models/Quiz");
const User = require("../models/User");
const Topic = require("../models/Topic");
const mongoose = require("mongoose");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// ✅ Quiz add karne ka route
router.post("/add-quiz", async (req, res) => {
  const { title, description, questions, topicId, allowedUsers } = req.body;

  try {
    // Topic exists check karo
    if (!mongoose.Types.ObjectId.isValid(topicId)) {
      return res.status(400).json({ message: "Invalid topicId" });
    }

    const topicExists = await Topic.findById(topicId);
    if (!topicExists) {
      return res.status(400).json({ message: "Topic not found" });
    }

    const quiz = new Quiz({ title, description, questions, topicId, allowedUsers });
    await quiz.save();
    res.status(201).json({ message: "Quiz added successfully!", quiz });
  } catch (err) {
    res.status(500).json({ message: "Error adding quiz", error: err.message });
  }
});

// ✅ Quiz edit karne ka route
router.put("/quizzes/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, questions, topicId, allowedUsers } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid quiz ID" });
    }

    // Topic exists check karo
    if (!mongoose.Types.ObjectId.isValid(topicId)) {
      return res.status(400).json({ message: "Invalid topicId" });
    }

    const topicExists = await Topic.findById(topicId);
    if (!topicExists) {
      return res.status(400).json({ message: "Topic not found" });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      { title, description, questions, topicId, allowedUsers },
      { new: true }
    );

    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json({ message: "Quiz updated successfully!", quiz: updatedQuiz });
  } catch (err) {
    res.status(500).json({ message: "Error updating quiz", error: err.message });
  }
});

// ✅ Quiz fetch karne ka route (by quizId)
router.get("/quizzes/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid quiz ID" });
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: "Error fetching quiz", error: err.message });
  }
});

// ✅ Quiz submit karne ka route
router.post("/quizzes/:id/submit", async (req, res) => {
  const { userId, score } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid quiz ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user already submitted this quiz
    const alreadySubmitted = user.completedQuizzes.some(
      (quiz) => quiz.quiz.toString() === req.params.id
    );

    if (alreadySubmitted) {
      return res.status(400).json({ message: "Quiz already submitted" });
    }

    // Add quiz to completedQuizzes with score
    user.completedQuizzes.push({
      quiz: req.params.id,
      score: score,
      attemptedAt: new Date(),
    });

    // Update total points
    user.points += score;

    await user.save();

    res.json({ message: "Quiz submitted successfully!", user });
  } catch (err) {
    console.error("Error submitting quiz:", err);
    res.status(500).json({ message: "Failed to submit quiz", error: err.message });
  }
});

// ✅ Quiz delete karne ka route
router.delete("/quizzes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid quiz ID" });
    }

    // Find the quiz to be deleted
    const deletedQuiz = await Quiz.findByIdAndDelete(id);
    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Remove this quiz from all users' completedQuizzes and update their points
    await User.updateMany(
      { "completedQuizzes.quiz": id },
      {
        $pull: { completedQuizzes: { quiz: id } }, // Remove the quiz from completedQuizzes
        $inc: { points: -deletedQuiz.score }, // Subtract the quiz score from user's total points
      }
    );

    res.json({ message: "Quiz deleted successfully!", quiz: deletedQuiz });
  } catch (err) {
    console.error("Error deleting quiz:", err);
    res.status(500).json({ message: "Error deleting quiz", error: err.message });
  }
});

// ✅ Get quizzes by topicId (only for allowed users)
router.get("/quizzes/topic/:topicId", authMiddleware, async (req, res) => {
  try {
    const { topicId } = req.params;
    const userId = req.user.id; // Get the user ID from the authenticated user

    // Validate topicId
    if (!mongoose.Types.ObjectId.isValid(topicId)) {
      return res.status(400).json({ message: "Invalid topicId" });
    }

    // Fetch quizzes for the topic where the user is in allowedUsers
    const quizzes = await Quiz.find({
      topicId,
      allowedUsers: { $in: [userId] }, // Only quizzes where the user is in allowedUsers
    });

    if (quizzes.length === 0) {
      return res.status(404).json({ message: "No quizzes found for this topic" });
    }

    res.json(quizzes);
  } catch (err) {
    console.error("Error fetching quizzes:", err);
    res.status(500).json({ message: "Error fetching quizzes", error: err.message });
  }
});

module.exports = router;