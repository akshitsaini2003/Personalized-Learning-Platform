const Quiz = require('../models/Quiz');

exports.createQuiz = async (req, res) => {
  const { title, description, questions, topicId } = req.body;
  const quiz = new Quiz({ title, description, questions, topicId });
  await quiz.save();
  res.status(201).json(quiz);
};

exports.getQuizzes = async (req, res) => {
  const quizzes = await Quiz.find();
  res.json(quizzes);
};

exports.getQuizById = async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  res.json(quiz);
};