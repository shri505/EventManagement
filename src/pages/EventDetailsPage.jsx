import React, { useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../firebase';
import '../styles/eventDetailsPage.css';

const EventDetailsPage = () => {
  // States to store event data and UI-related states
  const [upcomingEvents, setUpcomingEvents] = useState([]);  // List of upcoming events
  const [pastEvents, setPastEvents] = useState([]);  // List of past events
  const [cancelledEvents, setCancelledEvents] = useState([]);  // List of cancelled events
  const [confirmedEvents, setConfirmedEvents] = useState([]);  // List of confirmed events
  const [view, setView] = useState("upcoming");  // Current view (upcoming, past, cancelled)
  const [searchTerm, setSearchTerm] = useState("");  // Search term for filtering events
  const [editingEventId, setEditingEventId] = useState(null);  // Store event ID being edited
  const [newAttendeeCount, setNewAttendeeCount] = useState("");  // Store new attendee count when editing

  // useEffect hook to fetch events from Firebase when component mounts
  useEffect(() => {
    const eventsRef = ref(database, 'events');
    // Listen for changes in the events data
    onValue(eventsRef, (snapshot) => {
      const eventsData = snapshot.val();
      if (eventsData) {
        const allEvents = Object.keys(eventsData).map(key => ({
          id: key,  // Add event ID to each event object
          ...eventsData[key],  // Spread event data
        }));
        
        // Sort events by date (ascending order)
        const sortedEvents = allEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
        const today = new Date();

        // Set upcoming, past, and cancelled events based on the date and status
        setUpcomingEvents(sortedEvents.filter(event => event.isConfirmed && !event.isCancelled && new Date(event.date) >= today));
        setPastEvents(sortedEvents.filter(event => event.isConfirmed && !event.isCancelled && new Date(event.date) < today));
        setCancelledEvents(sortedEvents.filter(event => event.isCancelled));
        setConfirmedEvents(sortedEvents.filter(event => event.isConfirmed && !event.isCancelled));
      }
    });
  }, []);  // Empty dependency array means this runs once on component mount

  // Handle check-in for an event
  const handleCheckIn = async (eventId) => {
    const checkInRef = ref(database, `events/${eventId}`);
    const checkInTime = new Date().toISOString();
    try {
      // Update the event with check-in time in Firebase
      await update(checkInRef, { checkInTime });
      alert('Checked in successfully!');
      // Update the UI with the check-in time
      setUpcomingEvents(prevEvents =>
        prevEvents.map(event => event.id === eventId ? { ...event, checkInTime } : event)
      );
    } catch (error) {
      alert('Failed to check-in: ' + error.message);
    }
  };

  // Handle check-out for an event
  const handleCheckOut = async (eventId) => {
    const checkOutRef = ref(database, `events/${eventId}`);
    const checkOutTime = new Date().toISOString();
    try {
      // Update the event with check-out time in Firebase
      await update(checkOutRef, { checkOutTime });
      alert('Checked out successfully!');
      // Update the UI with the check-out time
      setUpcomingEvents(prevEvents =>
        prevEvents.map(event => event.id === eventId ? { ...event, checkOutTime } : event)
      );
    } catch (error) {
      alert('Failed to check-out: ' + error.message);
    }
  };

  // Handle cancelling an event
  const handleCancelEvent = async (eventId) => {
    const eventRef = ref(database, `events/${eventId}`);
    try {
      // Update the event status to cancelled in Firebase
      await update(eventRef, { isCancelled: true });
      alert('Event canceled!');
      // Remove the cancelled event from the upcoming events list
      setUpcomingEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
    } catch (error) {
      alert('Failed to cancel event: ' + error.message);
    }
  };

  // Handle editing the attendee count of an event
  const handleAttendeeEdit = (eventId, currentCount) => {
    setEditingEventId(eventId);  // Set the event ID to edit
    setNewAttendeeCount(currentCount);  // Set the current attendee count as the starting point
  };

  // Save the new attendee count to Firebase
  const handleSaveAttendeeCount = async (eventId) => {
    const eventRef = ref(database, `events/${eventId}`);
    try {
      // Update the attendee count in Firebase
      await update(eventRef, { peopleAttending: parseInt(newAttendeeCount, 10) });
      alert('Attendee count updated successfully!');
      setEditingEventId(null);  // Reset editing state
      // Update the UI with the new attendee count
      setUpcomingEvents(prevEvents =>
        prevEvents.map(event => event.id === eventId ? { ...event, peopleAttending: parseInt(newAttendeeCount, 10) } : event)
      );
    } catch (error) {
      alert('Failed to update attendee count: ' + error.message);
    }
  };

  // Filter events based on the search term
  const filteredEvents = (events) => {
    return events.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase())  // Check if the event title matches the search term
    );
  };

  // Render the events in a list of cards
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

            {/* Display check-in and check-out times if available */}
            {event.checkInTime && <p>Checked In at: {new Date(event.checkInTime).toLocaleString()}</p>}
            {event.checkOutTime && <p>Checked Out at: {new Date(event.checkOutTime).toLocaleString()}</p>}

            {/* Attendee Edit Section */}
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
              !event.isCancelled && (
                <button className="edit-attendee-button" onClick={() => handleAttendeeEdit(event.id, event.peopleAttending)}>
                  Edit Attendees
                </button>
              )
            )}

            {/* Check-In and Check-Out Buttons */}
            {!event.isCancelled && view === "upcoming" && !event.checkInTime && (
              <button className="check-in-button" onClick={() => handleCheckIn(event.id)}>
                Check In
              </button>
            )}
            {!event.isCancelled && view === "upcoming" && event.checkInTime && !event.checkOutTime && (
              <button className="check-out-button" onClick={() => handleCheckOut(event.id)}>
                Check Out
              </button>
            )}

            {/* Cancel Event Button */}
            {!event.isCancelled && (
              <button className="cancel-button" onClick={() => handleCancelEvent(event.id)}>
                Cancel Event
              </button>
            )}
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
