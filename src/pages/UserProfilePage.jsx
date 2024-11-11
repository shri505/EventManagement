import React, { useEffect, useState } from "react";
import moment from "moment";
import { database } from "../firebase";
import { ref, onValue } from "firebase/database";
import styles from "../styles/userProfilePage.module.css";

const UserProfilePage = () => {
  const [userDetails, setUserDetails] = useState({});
  const [events, setEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    // Fetch user details from Firebase
    const userRef = ref(database, "userDetails");
    onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      if (userData) {
        setUserDetails(userData);
      }
    });

    // Fetch events from Firebase and categorize into past and upcoming
    const eventsRef = ref(database, "events");
    onValue(eventsRef, (snapshot) => {
      const eventsData = snapshot.val();
      if (eventsData) {
        const allEvents = Object.keys(eventsData).map((key) => ({
          id: key,
          ...eventsData[key],
          date: new Date(eventsData[key].date)
        }));
        
        // Separate past and upcoming events
        const currentDate = new Date();
        setPastEvents(allEvents.filter(event => event.date < currentDate));
        setUpcomingEvents(allEvents.filter(event => event.date >= currentDate));
      }
    });
  }, []);

  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.header}>User Profile</h1>
      <div className={styles.userInfo}>
        <h2>{userDetails.name}</h2>
        <p>Email: {userDetails.email}</p>
        <p>Phone: {userDetails.phone}</p>
        {/* Add other user details as necessary */}
      </div>

      <div className={styles.eventsSection}>
        <h2>Past Events</h2>
        {pastEvents.length ? (
          pastEvents.map(event => (
            <div key={event.id} className={styles.eventCard}>
              <h3>{event.title}</h3>
              <p>Date: {moment(event.date).format("MMMM DD, YYYY")}</p>
              <p>Location: {event.location}</p>
              <p>Description: {event.description}</p>
            </div>
          ))
        ) : (
          <p>No past events attended.</p>
        )}
      </div>

      <div className={styles.eventsSection}>
        <h2>Upcoming Events</h2>
        {upcomingEvents.length ? (
          upcomingEvents.map(event => (
            <div key={event.id} className={styles.eventCard}>
              <h3>{event.title}</h3>
              <p>Date: {moment(event.date).format("MMMM DD, YYYY")}</p>
              <p>Location: {event.location}</p>
              <p>Description: {event.description}</p>
            </div>
          ))
        ) : (
          <p>No upcoming events.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
