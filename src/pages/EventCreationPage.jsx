import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, push, update, onValue } from 'firebase/database';
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
  const [events, setEvents] = useState([]);
  const [cancelledEvents, setCancelledEvents] = useState([]);
  const [view, setView] = useState("confirmed");
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    const eventsRef = ref(database, 'events');
    onValue(eventsRef, (snapshot) => {
      const eventsData = snapshot.val();
      if (eventsData) {
        const allEvents = Object.keys(eventsData).map(key => ({ id: key, ...eventsData[key] }));
        setEvents(allEvents.filter(event => event.isConfirmed && !event.isCancelled));
        setCancelledEvents(allEvents.filter(event => event.isCancelled));
      }
    });
  }, []);

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

  const handleCheckIn = async (eventId) => {
    const checkInRef = ref(database, `events/${eventId}`);
    const checkInTime = new Date().toISOString();
    try {
      await update(checkInRef, { checkInTime });
      alert('Checked in successfully!');
    } catch (error) {
      alert('Failed to check-in: ' + error.message);
    }
  };

  const handleCheckOut = async (eventId) => {
    const checkOutRef = ref(database, `events/${eventId}`);
    const checkOutTime = new Date().toISOString();
    try {
      await update(checkOutRef, { checkOutTime });
      alert('Checked out successfully!');
    } catch (error) {
      alert('Failed to check-out: ' + error.message);
    }
  };

  const handleCancelEvent = async (eventId) => {
    const eventRef = ref(database, `events/${eventId}`);
    try {
      await update(eventRef, { isCancelled: true });
      alert('Event canceled!');
    } catch (error) {
      alert('Failed to cancel event: ' + error.message);
    }
  };

  const handleEditAttendees = (event) => {
    setEditingEvent(event);
  };

  const handleSaveAttendees = async () => {
    if (!editingEvent) return;
    const eventRef = ref(database, `events/${editingEvent.id}`);
    try {
      await update(eventRef, { peopleAttending: editingEvent.peopleAttending });
      alert('People attending updated successfully!');
      setEditingEvent(null);
    } catch (error) {
      alert('Failed to update attendees: ' + error.message);
    }
  };

  const toggleView = (viewType) => {
    setView(viewType);
  };

  return (
    <div>
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

      <button onClick={() => toggleView("confirmed")} className={styles.viewButton}>Confirmed Events</button>
      <button onClick={() => toggleView("cancelled")} className={styles.viewButton}>Cancelled Events</button>

      {view === "confirmed" ? (
        <>
          <h2>Confirmed Events</h2>
          <ul>
          {events.map(event => (
  <li key={event.id} className={styles.eventCard}>
    <h3>{event.title}</h3>
    <p>{event.date} at {event.time}</p>
    <p>Location: {event.location}</p>
    <p>{event.description}</p>
    <p>Category: {event.category}</p>
    <p>Organizer: {event.organizerName}</p>
    <p>Contact: {event.contactNumber}</p>
    <p>
      People Attending:{" "}
      {editingEvent && editingEvent.id === event.id ? (
        <input
          type="number"
          value={editingEvent.peopleAttending}
          onChange={(e) => setEditingEvent({ ...editingEvent, peopleAttending: e.target.value })}
          className={styles.inputField}
        />
      ) : (
        event.peopleAttending
      )}
    </p>
    
    {/* Display check-in and check-out times if available */}
    {event.checkInTime && <p>Check-In Time: {new Date(event.checkInTime).toLocaleString()}</p>}
    {event.checkOutTime && <p>Check-Out Time: {new Date(event.checkOutTime).toLocaleString()}</p>}
    
    {editingEvent && editingEvent.id === event.id ? (
      <button onClick={handleSaveAttendees} className={styles.saveButton}>Save</button>
    ) : (
      <button onClick={() => handleEditAttendees(event)} className={styles.editButton}>Edit Attendees</button>
    )}
    
    {!event.checkInTime && (
      <button onClick={() => handleCheckIn(event.id)} className={styles.checkInButton}>Check-In</button>
    )}
    {event.checkInTime && !event.checkOutTime && (
      <button onClick={() => handleCheckOut(event.id)} className={styles.checkOutButton}>Check-Out</button>
    )}
    {!event.checkInTime && !event.checkOutTime && (
      <button onClick={() => handleCancelEvent(event.id)} className={styles.cancelButton}>Cancel Event</button>
    )}
  </li>
))}

          </ul>
        </>
      ) : (
        <>
          <h2>Cancelled Events</h2>
          <ul>
            {cancelledEvents.map(event => (
              <li key={event.id} className={styles.eventCard}>
                <h3>{event.title} (Cancelled)</h3>
                <p>{event.date} at {event.time}</p>
                <p>Location: {event.location}</p>
                <p>{event.description}</p>
                <p>Category: {event.category}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default EventCreationPage;
