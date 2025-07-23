import React, { useState, useEffect } from "react";
import { Container, Form, Button, Card, Alert, Row, Col } from "react-bootstrap";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profilePicture: "",
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  // Load logged-in user details
  useEffect(() => {
    // Simulating API call / LocalStorage Fetch
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      setProfile({
        name: loggedInUser.name || "John Doe",
        email: loggedInUser.email || "john@example.com",
        profilePicture: loggedInUser.profilePicture || "",
      });
    }
  }, []);

  // Handle Profile Picture Upload
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({
          ...prev,
          profilePicture: reader.result,
        }));
        localStorage.setItem("loggedInUser", JSON.stringify({ ...profile, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Password Change
  const handlePasswordChange = () => {
    if (password !== confirmPassword) {
      setMessage({ text: "Passwords do not match!", type: "danger" });
      return;
    }
    setMessage({ text: "Password updated successfully!", type: "success" });
    setPassword("");
    setConfirmPassword("");
    // TODO: Send password update request to backend
  };

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow-lg border-0 rounded-4">
        <h2 className="text-center mb-4">Profile Settings</h2>

        {/* Feedback Message */}
        {message.text && <Alert variant={message.type}>{message.text}</Alert>}

        <Row className="align-items-center">
          {/* Profile Picture Section */}
          <Col md={4} className="text-center">
            <img
              src={profile.profilePicture || "https://via.placeholder.com/150"}
              alt="Profile"
              className="rounded-circle shadow-sm border"
              width="150"
              height="150"
            />
            <Form.Group className="mt-3">
              <Form.Control type="file" accept="image/*" onChange={handleProfilePictureChange} />
            </Form.Group>
          </Col>

          {/* Profile Details */}
          <Col md={8}>
            <Form>
              <Form.Group>
                <Form.Label><strong>Name:</strong></Form.Label>
                <Form.Control type="text" value={profile.name} disabled className="bg-light" />
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Label><strong>Email:</strong></Form.Label>
                <Form.Control type="email" value={profile.email} disabled className="bg-light" />
              </Form.Group>
            </Form>
          </Col>
        </Row>

        {/* Change Password Section */}
        <h3 className="mt-4">Change Password</h3>
        <Form>
          <Form.Group>
            <Form.Label>New Password:</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mt-2">
            <Form.Label>Confirm Password:</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          <div className="text-center mt-3">
            <Button variant="primary" onClick={handlePasswordChange}>
              Update Password
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default Profile;
