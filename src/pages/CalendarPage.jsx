import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { database } from "../firebase";
import { ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import styles from "../styles/calendarpage.module.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const eventsRef = ref(database, "events");
    onValue(eventsRef, (snapshot) => {
      const eventsData = snapshot.val();
      if (eventsData) {
        const allEvents = Object.keys(eventsData).map((key) => ({
          id: key,
          ...eventsData[key],
          start: new Date(eventsData[key].date),
          end: new Date(eventsData[key].date),
        }));
        setEvents(allEvents);
      }
    });
  }, []);

  const handleSelectSlot = ({ start }) => {
    // Check if the selected date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day
    if (start >= today) {
      setShowModal(true); // Allow event creation for today or future dates
    } else {
      alert("Cannot create events for past dates.");
    }
  };

  const confirmCreateEvent = () => {
    setShowModal(false);
    navigate("/create-event");
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className={styles.calendarContainer}>
      <h1 className={styles.header}>Event Calendar</h1>
      <Calendar
        localizer={localizer}
        events={events}
        selectable
        defaultDate={new Date()}
        defaultView="month"
        views={["month", "week", "day", "agenda"]}
        style={{ height: "calc(90vh - 100px)", width: "90%" }}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        className={styles.rbcCalendar}
      />

      {/* Conditionally render selected event details */}
      {selectedEvent && (
        <div className={styles.eventDetails}>
          <h2>Event Details</h2>
          <div className={styles.eventCard}>
            <h3>{selectedEvent.title}</h3>
            <p>Date: {moment(selectedEvent.start).format("MMMM DD, YYYY")}</p>
            <p>Location: {selectedEvent.location}</p>
            <p>Description: {selectedEvent.description}</p>
          </div>
        </div>
      )}

      {/* Modal for creating a new event */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Do you want to create a new event?</h3>
            <button onClick={confirmCreateEvent}>Yes</button>
            <button onClick={closeModal}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
