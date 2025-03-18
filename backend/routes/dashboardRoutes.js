const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Quiz = require("../models/Quiz");
const authMiddleware = require("../middlewares/authMiddleware");

// Fetch dashboard data
router.get("/dashboard", authMiddleware, async (req, res) => {
  const userId = req.user.id; // Authenticated user ka ID

  try {
    const user = await User.findById(userId).select("-password"); // Password exclude karo
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch quiz titles for recent activity and calculate total points
    let totalPoints = 0;
    const recentActivity = await Promise.all(
      user.completedQuizzes.map(async (quiz) => {
        const quizData = await Quiz.findById(quiz.quiz);
        if (!quizData) {
          // Quiz delete ho gaya hai
          return null;
        }
        totalPoints += quiz.score || 0; // Add quiz score to total points
        return {
          type: "Quiz",
          description: `Completed '${quizData.title}' quiz with ${quiz.score || 0} points`,
          attemptedAt: quiz.attemptedAt,
          quiz: quizData, // Include quiz data
          score: quiz.score || 0, // Include quiz score
        };
      })
    );

    // Remove null entries (deleted quizzes)
    const filteredRecentActivity = recentActivity.filter((activity) => activity !== null);

    // Update user's points and quizzesCompleted
    user.points = totalPoints; // Update total points
    user.quizzesCompleted = filteredRecentActivity.length; // Update quizzes completed

    await user.save();

    // Dashboard data prepare karo
    const dashboardData = {
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points, // Include user's total points
      },
      quizzesCompleted: user.quizzesCompleted,
      interests: user.interests,
      recentActivity: filteredRecentActivity,
    };

    res.status(200).json(dashboardData);
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    res.status(500).json({ message: "An error occurred. Please try again." });
  }
});

module.exports = router;