import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar"; // Import the calendar component and necessary libraries
import moment from "moment";  // Import moment.js for date formatting
import { database } from "../firebase"; // Import Firebase database connection
import { ref, onValue } from "firebase/database";  // Import Firebase functions to read data
import { useNavigate } from "react-router-dom";  // Import React Router's navigate function for page navigation
import styles from "../styles/calendarpage.module.css";  // Import styling for the calendar page
import "react-big-calendar/lib/css/react-big-calendar.css"; // Import the calendar's default CSS

// Set locale for the calendar (English - GB format)
moment.locale("en-GB");

// Initialize the calendar localizer with moment.js
const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  // States for managing events and calendar interactions
  const [events, setEvents] = useState([]);  // Store events from Firebase
  const [selectedEvent, setSelectedEvent] = useState(null);  // Store selected event details
  const [showModal, setShowModal] = useState(false);  // Control visibility of the modal to create an event
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());  // Store the selected year for the year selector
  const [currentDate, setCurrentDate] = useState(new Date()); // Track the current displayed date
  const navigate = useNavigate();  // Initialize navigate function for routing to the event creation page

  // Fetch events from Firebase database
  useEffect(() => {
    const eventsRef = ref(database, "events");  // Reference to 'events' node in Firebase
    onValue(eventsRef, (snapshot) => {  // Listen for changes to the events data
      const eventsData = snapshot.val();  // Get data from Firebase
      if (eventsData) {
        const allEvents = Object.keys(eventsData).map((key) => ({
          id: key,
          ...eventsData[key],
          start: new Date(eventsData[key].date),  // Convert string date to Date object
          end: new Date(eventsData[key].date),  // Set end date as same as start date
        }));
        setEvents(allEvents);  // Update the state with the fetched events
      }
    });
  }, []);  // Empty dependency array, so this effect runs only once on mount

  // Handler for selecting a slot in the calendar
  const handleSelectSlot = ({ start }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // Set time to midnight for comparison
    if (start >= today) {  // If the selected date is today or in the future
      setShowModal(true);  // Show the modal to confirm creating a new event
    } else {
      alert("Cannot create events for past dates.");  // Alert if a past date is selected
    }
  };

  // Confirms the creation of a new event and navigates to the event creation page
  const confirmCreateEvent = () => {
    setShowModal(false);  // Close the modal
    navigate("/create-event");  // Navigate to the event creation page
  };

  // Handler for selecting an event from the calendar
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);  // Set the selected event to display its details
  };

  // Close the modal without creating an event
  const closeModal = () => {
    setShowModal(false);  // Simply close the modal
  };

  // Handler for changing the selected year from the dropdown
  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value, 10);  // Get the selected year
    setSelectedYear(newYear);  // Update the year state
    setCurrentDate(new Date(newYear, 0, 1));  // Update the calendar's current date to the 1st January of the selected year
  };

  // Handler for navigating through the calendar
  const handleNavigate = (date) => {
    setCurrentDate(date);  // Update the current date to the date clicked in the calendar
  };

  return (
    <div className={styles.calendarContainer}>
      {/* Header for the page */}
      <h1 className={styles.header}>Event Calendar</h1>

      {/* Year Selector */}
      <div className={styles.yearSelector}>
        <label htmlFor="year">Select Year: </label>
        <select id="year" value={selectedYear} onChange={handleYearChange}>
          {Array.from({ length: 10 }, (_, i) => {  // Create a range of years from 5 years ago to 5 years in the future
            const year = new Date().getFullYear() - 5 + i;
            return (
              <option key={year} value={year}>
                {year}  {/* Display each year in the dropdown */}
              </option>
            );
          })}
        </select>
      </div>

      {/* Calendar component */}
      <Calendar
        localizer={localizer}
        events={events}  // Pass the events fetched from Firebase
        selectable  // Allow selecting time slots on the calendar
        date={currentDate}  // Set the initial date to the current date
        defaultView="month"  // Set the default view to month view
        views={{ month: true, week: true, day: true, agenda: true }}  // Enable multiple views
        style={{ height: "calc(90vh - 100px)", width: "90%" }}  // Style the calendar size
        onSelectEvent={handleSelectEvent}  // Handle event selection
        onSelectSlot={handleSelectSlot}  // Handle slot selection (for creating events)
        onNavigate={handleNavigate}  // Handle calendar navigation (month, day, week changes)
        className={styles.rbcCalendar}  // Apply custom styles
      />

      {/* Display selected event details */}
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

      {/* Modal for confirming event creation */}
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
