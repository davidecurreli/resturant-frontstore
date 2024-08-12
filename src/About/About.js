import React from 'react';
import './About.css';

const About = () => (
  <div className="about-container">
    <h1>About Our Restaurant</h1>
    
    <div className="about-section">
      <h2>Our Story</h2>
      <p>Founded in 2010, our restaurant has been serving delicious meals and creating memorable dining experiences for over a decade. We pride ourselves on using the freshest ingredients and innovative cooking techniques to bring you extraordinary flavors.</p>
    </div>
    
    <div className="about-section">
      <h2>Our Mission</h2>
      <p>Our mission is to provide our guests with a unique culinary journey, combining traditional recipes with modern twists. We strive to create a warm and welcoming atmosphere where friends and families can gather to enjoy great food and company.</p>
    </div>
    
    <div className="about-section">
      <h2>Meet Our Team</h2>
      <div className="team-members">
        <div className="team-member">
          <img src="/images/chef1.png" alt="Chef John Doe" />
          <h3>John Doe</h3>
          <p>Head Chef</p>
        </div>
        <div className="team-member">
          <img src="/images/chef2.png" alt="Manager Jane Smith" />
          <h3>Jane Smith</h3>
          <p>Restaurant Manager</p>
        </div>
        <div className="team-member">
          <img src="/images/chef3.png" alt="Sous Chef Mike Johnson" />
          <h3>Mike Johnson</h3>
          <p>Sous Chef</p>
        </div>
      </div>
    </div>
  </div>
);

export default About;