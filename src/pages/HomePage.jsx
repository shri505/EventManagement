// src/pages/HomePage.jsx

import React from 'react';
import '../styles/homepage.css';
import VideoFile from '../assets/eventvideo.mp4';
import Image1 from '../assets/concerthall.jpg';
import Image2 from '../assets/conferencehall.jpg';
import Image3 from '../assets/workshophall.jpg';

const HomePage = () => {
  return (
    <div className="home-page-container">
      {/* Information Section */}
      <div className="home-info-section">
        <h2 className="info-line-1">Welcome to Event Management platform <br></br>for booking events</h2>
        <p className="info-line-2">Creating Unforgettable Experiences</p>
        <p className="info-line-3">Specializing in Concerts, Conferences, and Workshops</p>
      </div>

      {/* Video Section */}
      <div className="home-video-section">
        <video
          src={VideoFile}
          autoPlay
          muted
          loop
          className="home-promo-video"
        />
      </div>
      {/* Information Section */}
      <div className="home-info-section2">
        <p className="info2-line-2">Why people choose us </p>
        <p className="info2-line-3">We provide all the facilities in your small budget </p>
      </div>

      {/* Events Section */}
      <div className="home-events-section">
        <div className="home-event-card">
          <img src={Image1} alt="Event 1" className="home-event-image" />
          <div className="home-event-info">
            <h3 className="home-event-title">Concert Hall</h3>
            <p className="home-event-description">
            "Experience the magic of live performances in our state-of-the-art Concert Hall!
             🎤 With exceptional acoustics, a spacious stage, and seating for 15000 people, it's
              the perfect venue for concerts, live shows, and musical events. Whether you're hosting
               a large crowd or an intimate gathering, we provide top-notch facilities for an unforgettable experience. Book your concert today and let the music take center stage! 🎶
              #ConcertHall #LiveMusicExperience #EventVenue"</p>
          </div>
        </div>

        <div className="home-event-card">
          <img src={Image2} alt="Event 2" className="home-event-image" />
          <div className="home-event-info">
            <h3 className="home-event-title">Conference Hall</h3>
            <p className="home-event-description">
            "Host your next professional event in our fully-equipped Conference Hall!
            💼 Designed for seminars, conferences, and corporate gatherings, it features 
            modern AV technology, comfortable seating, and versatile spaces for breakout sessions.
             With a capacity of 100 people, it's the ideal location for impactful discussions and networking. Take your event to the next level—book our Conference Hall today! 🏢
              #ConferenceHall #BusinessEvents #NetworkingOpportunities"</p>
          </div>
        </div>

        <div className="home-event-card">
          <img src={Image3} alt="Event 3" className="home-event-image" />
          <div className="home-event-info">
            <h3 className="home-event-title">Workshop Hall</h3>
            <p className="home-event-description">
            "Boost your creativity and productivity in our Workshop Hall! 🛠️
             Perfect for hands-on training, workshops, and interactive learning sessions.
              With flexible seating arrangements, high-tech equipment, and a collaborative environment, 
              our workshop hall is designed to inspire and engage participants. Whether it's a small group
              or a larger session, our space is tailored to your needs. Reserve today and start learning! 📚
            #WorkshopHall #SkillBuilding #LearningEnvironment"            </p>
            
          </div>
        </div>
      </div>
      <footer className="home-footer">
        <div className="footer-section">
          <h4>Products</h4>
          <p>Event Management Software</p>
          <p>Venue Management Software</p>
          <p>Event Floor Plan Software</p>
          <p>Event Planning</p>
        </div>

        <div className="footer-section">
          <h4>Event Types</h4>
          <p>Corporate Events</p>
          <p>Event Planners & Firms</p>
          <p>Meetings & Conferences</p>
          <p>Non-Profits & Charities</p>
        </div>

        <div className="footer-section">
          <h4>Venues</h4>
          <p>Schools & Universities</p>
          <p>Wedding Planners</p>
          <p>Venues & Caterers</p>
          <p>Event & Conference Centers</p>
        </div>

        <div className="footer-section">
          <h4>Key Features</h4>
          <p>Banquet Event Orders</p>
          <p>Budgeting & Contracts</p>
          <p>Proposals & Seating Charts</p>
          <p>Invoicing & Payments</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
