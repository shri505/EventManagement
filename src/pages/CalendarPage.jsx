import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
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
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [currentDate, setCurrentDate] = useState(new Date()); // New state
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (start >= today) {
      setShowModal(true);
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

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value, 10));
    setCurrentDate(new Date(parseInt(e.target.value, 10), 0, 1));
  };

  const handleNavigate = (date) => {
    setCurrentDate(date);
  };

  return (
    <div className={styles.calendarContainer}>
      <h1 className={styles.header}>Event Calendar</h1>

      {/* Year Selector */}
      <div className={styles.yearSelector}>
        <label htmlFor="year">Select Year: </label>
        <select id="year" value={selectedYear} onChange={handleYearChange}>
          {Array.from({ length: 10 }, (_, i) => {
            const year = new Date().getFullYear() - 5 + i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        selectable
        date={currentDate}
        defaultView="month"
        views={{ month: true, week: true, day: true, agenda: true }}
        style={{ height: "calc(90vh - 100px)", width: "90%" }}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        onNavigate={handleNavigate} // Add navigation handler
        className={styles.rbcCalendar}
      />

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
