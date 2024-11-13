import React, { useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../firebase';
import '../styles/eventDetailsPage.css';

const EventDetailsPage = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [cancelledEvents, setCancelledEvents] = useState([]);
  const [confirmedEvents, setConfirmedEvents] = useState([]);
  const [view, setView] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingEventId, setEditingEventId] = useState(null);
  const [newAttendeeCount, setNewAttendeeCount] = useState("");

  useEffect(() => {
    const eventsRef = ref(database, 'events');
    onValue(eventsRef, (snapshot) => {
      const eventsData = snapshot.val();
      if (eventsData) {
        const allEvents = Object.keys(eventsData).map(key => ({
          id: key,
          ...eventsData[key]
        }));
        
        const sortedEvents = allEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
        const today = new Date();

        setUpcomingEvents(sortedEvents.filter(event => event.isConfirmed && !event.isCancelled && new Date(event.date) >= today));
        setPastEvents(sortedEvents.filter(event => event.isConfirmed && !event.isCancelled && new Date(event.date) < today));
        setCancelledEvents(sortedEvents.filter(event => event.isCancelled));
        setConfirmedEvents(sortedEvents.filter(event => event.isConfirmed && !event.isCancelled));
      }
    });
  }, []);

  const handleCheckIn = async (eventId) => {
    const checkInRef = ref(database, `events/${eventId}`);
    const checkInTime = new Date().toISOString();
    try {
      await update(checkInRef, { checkInTime });
      alert('Checked in successfully!');
      setUpcomingEvents(prevEvents =>
        prevEvents.map(event => event.id === eventId ? { ...event, checkInTime } : event)
      );
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
      setUpcomingEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
    } catch (error) {
      alert('Failed to cancel event: ' + error.message);
    }
  };

  const handleAttendeeEdit = (eventId, currentCount) => {
    setEditingEventId(eventId);
    setNewAttendeeCount(currentCount);
  };

  const handleSaveAttendeeCount = async (eventId) => {
    const eventRef = ref(database, `events/${eventId}`);
    try {
      await update(eventRef, { peopleAttending: parseInt(newAttendeeCount, 10) });
      alert('Attendee count updated successfully!');
      setEditingEventId(null);
      setUpcomingEvents(prevEvents =>
        prevEvents.map(event => event.id === eventId ? { ...event, peopleAttending: parseInt(newAttendeeCount, 10) } : event)
      );
    } catch (error) {
      alert('Failed to update attendee count: ' + error.message);
    }
  };

  const filteredEvents = (events) => {
    return events.filter(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderEvents = (events) => (
    <div className="event-card-container">
      {filteredEvents(events).map(event => (
        <div key={event.id} className="event-card">
          <div className="event-info">
            <h3>{event.title}</h3>
            <p>{event.date} at {event.time}</p>
            <p>Location: {event.location}</p>
            <p>{event.description}</p>
            <p>Category: {event.category}</p>
            <p>Organizer: {event.organizerName}</p>
            <p>Contact: {event.contactNumber}</p>
            <p>People Attending: {event.peopleAttending}</p>
            {event.id === editingEventId ? (
              <div>
                <input
                  type="number"
                  className="attendee-input"
                  value={newAttendeeCount}
                  onChange={(e) => setNewAttendeeCount(e.target.value)}
                />
                <button className="save-button" onClick={() => handleSaveAttendeeCount(event.id)}>
                  Save
                </button>
              </div>
            ) : (
              <button className="edit-attendee-button" onClick={() => handleAttendeeEdit(event.id, event.peopleAttending)}>
                Edit Attendees
              </button>
            )}
            <button className="check-in-button" onClick={() => handleCheckIn(event.id)}>
              Check In
            </button>
            <button className="check-out-button" onClick={() => handleCheckOut(event.id)}>
              Check Out
            </button>
            <button className="cancel-button" onClick={() => handleCancelEvent(event.id)}>
              Cancel Event
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="event-details-page">
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="view-toggle">
        <button className="view-button" onClick={() => setView("upcoming")}>Upcoming Events</button>
        <button className="view-button" onClick={() => setView("past")}>Past Events</button>
        <button className="view-button" onClick={() => setView("cancelled")}>Cancelled Events</button>
      </div>
      {view === "upcoming" && renderEvents(upcomingEvents)}
      {view === "past" && renderEvents(pastEvents)}
      {view === "cancelled" && renderEvents(cancelledEvents)}
    </div>
  );
};

export default EventDetailsPage;
