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
    <ul>
      {filteredEvents(events).map(event => (
        <li key={event.id} className="event-card">
          <h3>{event.title}</h3>
          <p>{event.date} at {event.time}</p>
          <p>Location: {event.location}</p>
          <p>{event.description}</p>
          <p>Category: {event.category}</p>
          <p>Organizer: {event.organizerName}</p>
          <p>Contact: {event.contactNumber}</p>
          <p>People Attending: {event.peopleAttending}</p>
          
          {editingEventId === event.id ? (
            <div>
              <input 
                type="number" 
                value={newAttendeeCount} 
                onChange={(e) => setNewAttendeeCount(e.target.value)}
                className="attendee-input"
              />
              <button onClick={() => handleSaveAttendeeCount(event.id)} className="save-button">Save</button>
            </div>
          ) : (
            <button onClick={() => handleAttendeeEdit(event.id, event.peopleAttending)} className="edit-attendee-button">
              Edit Attendee Count
            </button>
          )}
  
          {event.checkInTime && <p>Check-In Time: {new Date(event.checkInTime).toLocaleString()}</p>}
          {event.checkOutTime && <p>Check-Out Time: {new Date(event.checkOutTime).toLocaleString()}</p>}
  
          {/* Conditionally render buttons based on the view */}
          {view !== "cancelled" && view !== "past" && (
            <>
              {!event.checkInTime && (
                <button onClick={() => handleCheckIn(event.id)} className="check-in-button">Check-In</button>
              )}
              {event.checkInTime && !event.checkOutTime && (
                <button onClick={() => handleCheckOut(event.id)} className="check-out-button">Check-Out</button>
              )}
              {!event.checkInTime && (
                <button onClick={() => handleCancelEvent(event.id)} className="cancel-button">Cancel Event</button>
              )}
            </>
          )}
        </li>
      ))}
    </ul>
  );
  

  return (
    <div className="event-details-page">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search events by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="view-toggle">
        <button onClick={() => setView("upcoming")} className="view-button">Upcoming Events</button>
        <button onClick={() => setView("past")} className="view-button">Past Events</button>
        <button onClick={() => setView("confirmed")} className="view-button">Confirmed Events</button>
        <button onClick={() => setView("cancelled")} className="view-button">Cancelled Events</button>
      </div>

      {view === "upcoming" && (
        <div >
          <h3>Upcoming Events</h3>
          {renderEvents(upcomingEvents)}
        </div>
      )}
      {view === "past" && (
        <div >
          <h3>Past Events</h3>
          {renderEvents(pastEvents)}
        </div>
      )}
      {view === "confirmed" && (
        <div >
          <h3>Confirmed Events</h3>
          {renderEvents(confirmedEvents)}
        </div>
      )}
      {view === "cancelled" && (
        <div >
          <h3>Cancelled Events</h3>
          {renderEvents(cancelledEvents)}
        </div>
      )}
    </div>
  );
};

export default EventDetailsPage;
