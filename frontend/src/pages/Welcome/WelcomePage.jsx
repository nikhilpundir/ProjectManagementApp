import React from 'react';
import { Button } from 'antd';
import './WelcomePage.css'; // Custom CSS for background image and styling
import { useNavigate } from 'react-router';
const WelcomePage = () => {
  const navigate= useNavigate();

  const handleRedirect = () => {
    navigate('login')
  };

  return (
    <div className="welcome-container">
      <div className="video-container">

        <iframe
          className="background-video"
          src="https://www.youtube.com/embed/8wH4XGJxV6c?autoplay=1&mute=1&controls=0&loop=1&playlist=8wH4XGJxV6c"
          title="Background Video"
          allow="autoplay; fullscreen"
          allowFullScreen

        ></iframe>
      </div>
      <div className="welcome-content">
        <h1>Welcome to My Application!</h1>
        <p>I am glad to have you here. Let's get started!</p>
        <Button type="primary" size="large" onClick={(handleRedirect)}>
          Let's Get Started
        </Button>
      </div>
    </div>

  );
};

export default WelcomePage;
