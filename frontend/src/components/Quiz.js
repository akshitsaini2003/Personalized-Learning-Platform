import React, { useState } from 'react';
import { Card, ListGroup, Form, Button, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';

function Quiz({ quiz, userId }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false); // Track if quiz is submitted

  const handleSubmit = async () => {
    if (isSubmitted) return; // Agar quiz already submit ho chuka hai, toh return kare

    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        score += 10; // Har sahi jawab ke liye 10 points
      }
    });

    try {
      const response = await fetch(`http://localhost:5000/api/quizzes/${quiz._id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, score }),
      });
      const data = await response.json();
      if (response.ok) {
        setResult(`Quiz submitted! Your score: ${score}`);
        setIsSubmitted(true); // Quiz submitted mark kare
        toast.success(`Quiz submitted! Your score: ${score}`); // Display success toast
      } else {
        setResult(data.message || 'Failed to submit quiz.');
        toast.error(data.message || 'Failed to submit quiz.'); // Display error toast
      }
    } catch (err) {
      setResult('An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.'); // Display error toast
    }
  };

  return (
    <Card className="mb-4 shadow">
      <Card.Body>
        <Card.Title className="text-center mb-4">{quiz.title}</Card.Title>
        <Card.Text className="text-muted text-center mb-4">{quiz.description}</Card.Text>
        {quiz.questions.map((question, index) => (
          <div key={index} className="mb-4">
            <Card.Subtitle className="mb-3">Question {index + 1}: {question.questionText}</Card.Subtitle>
            <ListGroup>
              {question.options.map((option, i) => (
                <ListGroup.Item key={i} className="d-flex align-items-center">
                  <Form.Check
                    type="radio"
                    name={`question-${index}`}
                    label={option}
                    value={option}
                    onChange={() => setSelectedAnswers({ ...selectedAnswers, [index]: option })}
                    disabled={isSubmitted} // Agar quiz submit ho chuka hai, toh options disable kare
                    className="w-100"
                  />
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        ))}
        <div className="text-center mt-4" style={{ marginTop: 'auto' }}>
          <Button variant="primary" onClick={handleSubmit} disabled={isSubmitted}>
            {isSubmitted ? 'Quiz Submitted' : 'Submit Quiz'}
          </Button>
        </div>
        {result && <Alert variant="info" className="mt-3">{result}</Alert>}
      </Card.Body>
    </Card>
  );
}

export default Quiz;