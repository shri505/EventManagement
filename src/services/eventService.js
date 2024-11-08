// src/services/eventService.js
import { database } from '../firebase';
import { ref, push, get, update, remove } from 'firebase/database';

export const createEvent = async (eventData) => {
  const eventsRef = ref(database, 'events');
  const newEventRef = push(eventsRef);
  await update(newEventRef, eventData);
  return newEventRef.key;
};

export const fetchEvents = async () => {
  const eventsRef = ref(database, 'events');
  const snapshot = await get(eventsRef);
  return snapshot.exists() ? snapshot.val() : {};
};

export const deleteEvent = async (eventId) => {
  const eventRef = ref(database, `events/${eventId}`);
  await remove(eventRef);
};
