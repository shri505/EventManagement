// src/pages/EventCreationPage.jsx
import React, { useState } from 'react';
import { database } from '../firebase';
import { ref, push } from 'firebase/database';

const EventCreationPage = () => {
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eventsRef = ref(database, 'events');
    try {
      await push(eventsRef, eventData);
      alert('Event created successfully');
    } catch (error) {
      alert('Failed to create event: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" placeholder="Event Title" onChange={handleChange} />
      <input type="date" name="date" placeholder="Event Date" onChange={handleChange} />
      <input type="time" name="time" placeholder="Event Time" onChange={handleChange} />
      <input type="text" name="location" placeholder="Event Location" onChange={handleChange} />
      <textarea name="description" placeholder="Event Description" onChange={handleChange}></textarea>
      <select name="category" onChange={handleChange}>
        <option value="workshop">Workshop</option>
        <option value="conference">Conference</option>
        <option value="concert">Concert</option>
      </select>
      <button type="submit">Create Event</button>
    </form>
  );
};

export default EventCreationPage;
