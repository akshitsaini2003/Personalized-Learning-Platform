import React, { useEffect, useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toast
import { useNavigate } from "react-router-dom"; // useNavigate hook for navigation

const Home = () => {
  const navigate = useNavigate(); // useNavigate hook ka use karein
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [userName, setUserName] = useState(''); // State to store user's name

  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token);
    }
  }, []);

  // Fetch user profile data
  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setIsLoggedIn(true);
        setUserName(data.name); // Set user's name
      } else {
        setIsLoggedIn(false);
        setUserName('');
      }
    } catch (err) {
      setIsLoggedIn(false);
      setUserName('');
    }
  };

  // Sign Up button par click karne par toast message show karein
  const handleSignUpClick = () => {
    toast.info("Redirecting to Sign Up page...", {
      autoClose: 2000, // 2 seconds ke baad toast automatically close ho jayega
    });
    setTimeout(() => {
      navigate("/signup"); // 2 seconds ke baad signup page par redirect karein
    }, 2000);
  };

  // Login button par click karne par toast message show karein
  const handleLoginClick = () => {
    toast.info("Redirecting to Login page...", {
      autoClose: 2000, // 2 seconds ke baad toast automatically close ho jayega
    });
    setTimeout(() => {
      navigate("/login"); // 2 seconds ke baad login page par redirect karein
    }, 2000);
  };

  // Logout button par click karne par user ko logout karein
  const handleLogout = () => {
    localStorage.removeItem('token'); // Token remove karein
    setIsLoggedIn(false); // Login status update karein
    setUserName(''); // User name clear karein
    toast.success("Logged out successfully!"); // Success toast show karein
  };

  return (
    <div
      className="d-flex flex-column"
      style={{ minHeight: "80vh", paddingTop: "56px", paddingBottom: "56px" }} // Adjusting for navbar & footer
    >
      <Container className="flex-grow-1 d-flex justify-content-center align-items-center">
        <Card
          className="text-center shadow-lg p-4"
          style={{ maxWidth: "500px", borderRadius: "12px" }}
        >
          <Card.Body>
            <Card.Title
              style={{
                fontSize: "1.75rem",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Welcome to{" "}
              <span style={{ color: "#007bff" }}>Personalized Learning</span>{" "}
              Platform
            </Card.Title>
            <Card.Text className="text-muted" style={{ fontSize: "1.1rem" }}>
              "Your journey to better learning starts here!"
            </Card.Text>
            <div className="mt-4">
              {isLoggedIn ? (
                // Logged in state: Show Welcome message and Logout button
                <div>
                  <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                    Welcome, {userName}!
                  </p>
                  <Button
                    variant="danger"
                    className="px-4 py-2"
                    style={{ borderRadius: "6px" }}
                    onClick={handleLogout}
                  >
                    Logout Now
                  </Button>
                </div>
              ) : (
                // Logged out state: Show Sign Up and Login buttons
                <div>
                  <Button
                    variant="primary"
                    className="px-4 py-2"
                    style={{ borderRadius: "6px" }}
                    onClick={handleSignUpClick}
                  >
                    Sign Up
                  </Button>
                  <Button
                    variant="success"
                    className="ms-3 px-4 py-2"
                    style={{ borderRadius: "6px" }}
                    onClick={handleLoginClick}
                  >
                    Login
                  </Button>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>
      </Container>
      <ToastContainer /> {/* ToastContainer ko add karein */}
    </div>
  );
};

export default Home;