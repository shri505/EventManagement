import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import moment from 'moment';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import '../styles/eventDetailsPage.css';

const EventDetailsPage = () => {
  const { eventTitle, eventDate } = useParams();
  const [event, setEvent] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filter, setFilter] = useState('upcoming');
  const [showDetails, setShowDetails] = useState(null); // Track the event to show details for

  useEffect(() => {
    const eventsRef = ref(database, 'events');
    onValue(eventsRef, (snapshot) => {
      const eventsData = snapshot.val();
      if (eventsData) {
        const eventList = Object.keys(eventsData).map((key) => ({
          ...eventsData[key],
          start: new Date(eventsData[key].date),
        }));
        setAllEvents(eventList);

        const selectedEvent = eventList.find(
          (e) =>
            e.title === eventTitle &&
            moment(e.start).format('YYYY-MM-DD') === eventDate
        );
        setEvent(selectedEvent || null);
      }
    });
  }, [eventTitle, eventDate]);

  useEffect(() => {
    const now = new Date();
    if (filter === 'upcoming') {
      setFilteredEvents(allEvents.filter((event) => new Date(event.start) > now));
    } else {
      setFilteredEvents(allEvents.filter((event) => new Date(event.start) <= now));
    }
  }, [filter, allEvents]);

  const handleShowDetails = (title, date) => {
    const selectedEvent = allEvents.find(
      (e) =>
        e.title === title &&
        moment(e.start).format('YYYY-MM-DD') === date
    );
    setShowDetails(selectedEvent);
  };

  return (
    <div className="event-details-page">
      {event && (
        <div>
          <h1>{event.title}</h1>
          <p>Date: {moment(event.start).format('MMMM DD, YYYY')}</p>
          <p>Location: {event.location}</p>
          <p>Description: {event.description}</p>
          <p>Category: {event.category}</p>
          <p>Organizer: {event.organizerName}</p>
          <p>Contact: {event.contactNumber}</p>
          <p>Attendees: {event.peopleAttending}</p>
        </div>
      )}

      <div className="filter-section">
        <button onClick={() => setFilter('upcoming')}>Upcoming Events</button>
        <button onClick={() => setFilter('past')}>Past Events</button>
      </div>

      <div className="event-list">
        <h2>{filter === 'upcoming' ? 'Upcoming Events' : 'Past Events'}</h2>
        <ul>
          {filteredEvents.map((e) => (
            <li key={e.title + e.date}>
              <h3>{e.title}</h3>
              <p>Date: {moment(e.start).format('MMMM DD, YYYY')}</p>
              <button onClick={() => handleShowDetails(e.title, moment(e.start).format('YYYY-MM-DD'))}>
                More Details
              </button>
              {showDetails && showDetails.title === e.title && showDetails.date === e.date && (
                <div className="event-details">
                  <p>Location: {showDetails.location}</p>
                  <p>Description: {showDetails.description}</p>
                  <p>Category: {showDetails.category}</p>
                  <p>Organizer: {showDetails.organizerName}</p>
                  <p>Contact: {showDetails.contactNumber}</p>
                  <p>Attendees: {showDetails.peopleAttending}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventDetailsPage;
