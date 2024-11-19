import React, { useState } from 'react'; 
import '../styles/aboutpage.css';

const AboutPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmail('');
    setMessage('');
    setRating(0);
  };

  return (
    <div className="container about-page">
      <section className="company-info">
        <h3>About Our Company</h3>
        <p>
          We are a dedicated team committed to simplifying event management through technology. Our company focuses on providing seamless, user-friendly tools to help you organize, track, and enhance your events with ease.
        </p>
      </section>

      <section className="app-info">
        <h3>About Our Event Management Application</h3>
        <p>
          Our event management application allows users to manage events with features like attendee tracking, event check-in and check-out, real-time updates, and more. It is suitable for both small and large events.
        </p>
      </section>

      <section className="feedback-form">
        <h2 className="title">Feedback Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email ID:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control thick feedback-input"
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group message">
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="form-control feedback-textarea"
              placeholder="Write your message here"
            ></textarea>
          </div>


          <div className="rating">
            <p>Rate Us:</p>
            {[1, 2, 3, 4, 5].map((num) => (
              <input
                key={num}
                type="radio"
                name="rating"
                onClick={() => setRating(num)}
                className="rating-input"
              />
            ))}
            <span id="envelope" className="emoji">{rating >= 3 ? "😊" : "😞"}</span>
          </div>

          <button type="submit" className="btn btn-primary feedback-submit-button">Submit</button>
        </form>
      </section>
      <section className="contact-info">
        <h5>Contact Us</h5>
        <p>Email: <a href="mailto:info@yourcompany.com">shrikantdshahapure@gmail.com</a></p>
      </section>
    </div>
  );
};

export default AboutPage;
