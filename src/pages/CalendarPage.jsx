import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { database } from "../firebase";
import { ref, onValue } from "firebase/database";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "../styles/calendarpage.module.css"; // Adjust path if necessary

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [events, setEvents] = useState([]);

  // Fetch events from Firebase on component mount
  useEffect(() => {
    const eventsRef = ref(database, "events");
    onValue(eventsRef, (snapshot) => {
      const eventsData = snapshot.val();
      if (eventsData) {
        const allEvents = Object.keys(eventsData).map((key) => ({
          id: key,
          ...eventsData[key],
          start: new Date(eventsData[key].date), // Convert date to Date object
          end: new Date(eventsData[key].date) // Use end date if applicable
        }));
        setEvents(allEvents);
      }
    });
  }, []);

  // Handle new event creation
  const handleSelectSlot = ({ start, end }) => {
    const title = window.prompt("Enter event title:");
    if (title) {
      const newEvent = { title, start, end };
      setEvents([...events, newEvent]);

      // Optionally, add new event to Firebase
      // const eventsRef = ref(database, "events");
      // push(eventsRef, {
      //   title,
      //   date: start.toISOString(),
      //   time: moment(start).format("HH:mm"),
      //   location: "Location TBD",
      //   description: "Event description",
      //   category: "Category TBD",
      //   organizerName: "Organizer TBD",
      //   contactNumber: "Contact TBD",
      //   peopleAttending: 0
      // });
    }
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
        style={{ height: "80vh", width: "90%", maxWidth: "800px" }}
        onSelectEvent={(event) => alert(`Event: ${event.title}`)}
        onSelectSlot={handleSelectSlot}
        className={styles.rbcCalendar} // Apply rbc-calendar styles here
      />
      <div className={styles.eventDetails}>
        <h2>Event Details</h2>
        {events.map((event) => (
          <div key={event.id} className={styles.eventCard}>
            <h3>{event.title}</h3>
            <p>Date: {moment(event.start).format("MMMM DD, YYYY")}</p>
            <p>Location: {event.location}</p>
            <p>Description: {event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarPage;
