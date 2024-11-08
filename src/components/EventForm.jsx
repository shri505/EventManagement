// src/components/EventForm.jsx
import React, { useState } from 'react';
import { database } from '../firebase';
import { ref, push } from 'firebase/database';

const EventForm = () => {
    const [event, setEvent] = useState({
        name: '',
        date: '',
        time: '',
        location: '',
        description: '',
        category: '',
    });

    const handleChange = (e) => setEvent({ ...event, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const eventsRef = ref(database, 'events');
        try {
            await push(eventsRef, event);
            alert('Event Created!');
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="name" onChange={handleChange} placeholder="Event Name" />
            <input type="date" name="date" onChange={handleChange} />
            <input type="time" name="time" onChange={handleChange} />
            <input name="location" onChange={handleChange} placeholder="Location" />
            <textarea name="description" onChange={handleChange} placeholder="Description"></textarea>
            <input name="category" onChange={handleChange} placeholder="Category" />
            <button type="submit">Create Event</button>
        </form>
    );
};

export default EventForm;
