import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, push, onValue } from 'firebase/database';
import styles from '../styles/eventcreationpage.module.css';

const EventCreationPage = () => {
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: '',
    organizerName: '',
    contactNumber: '',
    peopleAttending: '',
    isConfirmed: true,
  });

  useEffect(() => {
    const eventsRef = ref(database, 'events');
    onValue(eventsRef, (snapshot) => {
      const eventsData = snapshot.val();
      if (eventsData) {
        // Additional logic can be added here if needed
      }
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const validateForm = () => {
    const { title, date, time, location, description, category, organizerName, contactNumber, peopleAttending } = eventData;
    if (!title || !date || !time || !location || !description || !category || !organizerName || !contactNumber || !peopleAttending) {
      alert("Please fill in all required fields.");
      return false;
    }
    if (!/^\d{10}$/.test(contactNumber)) {
      alert("Please enter a valid 10-digit contact number.");
      return false;
    }
    if (peopleAttending < 1) {
      alert("Number of people attending should be at least 1.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const eventsRef = ref(database, 'events');
    const eventWithTimestamp = { ...eventData, timestamp: new Date().toISOString() };
    try {
      await push(eventsRef, eventWithTimestamp);
      alert('Event created successfully');
      setEventData({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        category: '',
        organizerName: '',
        contactNumber: '',
        peopleAttending: '',
        isConfirmed: true,
      });
    } catch (error) {
      alert('Failed to create event: ' + error.message);
    }
  };

  return (
    <div className={styles.eventCreationPage}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <input type="text" name="title" placeholder="Event Title" value={eventData.title} onChange={handleChange} className={styles.inputField} required />
        <input type="date" name="date" placeholder="Event Date" value={eventData.date} onChange={handleChange} className={styles.inputField} required />
        <input type="time" name="time" placeholder="Event Time" value={eventData.time} onChange={handleChange} className={styles.inputField} required />
        <input type="text" name="location" placeholder="Event Location" value={eventData.location} onChange={handleChange} className={styles.inputField} required />
        <textarea name="description" placeholder="Event Description" value={eventData.description} onChange={handleChange} className={styles.textareaField} required></textarea>
        <select name="category" value={eventData.category} onChange={handleChange} className={styles.selectField} required>
          <option value="">Select Category</option>
          <option value="workshop">Workshop</option>
          <option value="conference">Conference</option>
          <option value="concert">Concert</option>
        </select>
        <input type="text" name="organizerName" placeholder="Organizer Name" value={eventData.organizerName} onChange={handleChange} className={styles.inputField} required />
        <input type="tel" name="contactNumber" placeholder="Contact Number" value={eventData.contactNumber} onChange={handleChange} className={styles.inputField} required />
        <input type="number" name="peopleAttending" placeholder="People Attending" value={eventData.peopleAttending} onChange={handleChange} className={styles.inputField} required />
        <button type="submit" className={styles.submitButton}>Create Event</button>
      </form>
    </div>
  );
};

export default EventCreationPage;
