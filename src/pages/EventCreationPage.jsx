import React, { useState, useEffect } from 'react';
import { database } from '../firebase';  // Import Firebase database
import { ref, push, onValue } from 'firebase/database';  // Firebase database functions (to push data and listen for changes)
import styles from '../styles/eventcreationpage.module.css';  // Import styling for the page

const today = new Date().toISOString().split('T')[0];
const EventCreationPage = () => {
  // State for managing the event data input by the user
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
    isConfirmed: true,  // Event confirmation status
  });

  // UseEffect hook to listen for changes in the Firebase 'events' reference (optional for now)
  useEffect(() => {
    const eventsRef = ref(database, 'events');  // Reference to the 'events' collection in Firebase
    onValue(eventsRef, (snapshot) => {  // Listen for changes in the events data
      const eventsData = snapshot.val();  // Get the data from Firebase
      if (eventsData) {
        // Additional logic can be added here if needed to handle events data
      }
    });
  }, []);  // Empty dependency array means this effect runs only once after the component mounts

  // Handle changes in input fields and update the eventData state
  const handleChange = (e) => {
    const { name, value } = e.target;  // Extract name and value from the event target
    setEventData({ ...eventData, [name]: value });  // Update corresponding field in eventData state
  };

  // Form validation function before submitting the event data
  const validateForm = () => {
    const { title, date, time, location, description, category, organizerName, contactNumber, peopleAttending } = eventData;
    
    // Check if any of the required fields are empty
    if (!title || !date || !time || !location || !description || !category || !organizerName || !contactNumber || !peopleAttending) {
      alert("Please fill in all required fields.");  // Show an alert if any field is missing
      return false;
    }

    // Validate contact number to ensure it is a 10-digit number
    if (!/^\d{10}$/.test(contactNumber)) {
      alert("Please enter a valid 10-digit contact number.");  // Show an alert if the contact number is not valid
      return false;
    }

    // Ensure that at least one person is attending
    if (peopleAttending < 1) {
      alert("Number of people attending should be at least 1.");  // Show an alert if people attending is less than 1
      return false;
    }

    return true;  // If all checks pass, return true (form is valid)
  };

  // Handle form submission to save event data to Firebase
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent the default form submission behavior

    if (!validateForm()) return;  // If the form is invalid, don't submit

    const eventsRef = ref(database, 'events');  // Reference to the Firebase 'events' collection
    const eventWithTimestamp = { 
      ...eventData, 
      timestamp: new Date().toISOString()  // Add a timestamp when the event is created
    };

    try {
      await push(eventsRef, eventWithTimestamp);  // Push the event data to Firebase
      alert('Event created successfully');  // Show a success message
      // Reset form after successful event creation
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
      alert('Failed to create event: ' + error.message);  // Show error message if event creation fails
    }
  };

  return (
    <div className={styles.eventCreationPage}>
      {/* Event creation form */}
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        {/* Event Title input */}
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={eventData.title}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
        {/* Event Date input */}
        <input
          type="date"
          name="date"
          placeholder="Event Date"
          value={eventData.date}
          onChange={handleChange}
          className={styles.inputField}
          required
          min={today}
        />
        {/* Event Time input */}
        <input
          type="time"
          name="time"
          placeholder="Event Time"
          value={eventData.time}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
        {/* Event Location input */}
        <input
          type="text"
          name="location"
          placeholder="Event Location"
          value={eventData.location}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
        {/* Event Description input */}
        <textarea
          name="description"
          placeholder="Event Description"
          value={eventData.description}
          onChange={handleChange}
          className={styles.textareaField}
          required
        ></textarea>
        {/* Event Category dropdown */}
        <select
          name="category"
          value={eventData.category}
          onChange={handleChange}
          className={styles.selectField}
          required
        >
          <option value="">Select Category</option>
          <option value="workshop">Workshop</option>
          <option value="conference">Conference</option>
          <option value="concert">Concert</option>
        </select>
        {/* Organizer Name input */}
        <input
          type="text"
          name="organizerName"
          placeholder="Organizer Name"
          value={eventData.organizerName}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
        {/* Contact Number input */}
        <input
          type="tel"
          name="contactNumber"
          placeholder="Contact Number"
          value={eventData.contactNumber}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
        {/* Number of People Attending input */}
        <input
          type="number"
          name="peopleAttending"
          placeholder="People Attending"
          value={eventData.peopleAttending}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
        {/* Submit button */}
        <button type="submit" className={styles.submitButton}>
          Create Event
        </button>
      </form>
    </div>
  );
};

export default EventCreationPage;
