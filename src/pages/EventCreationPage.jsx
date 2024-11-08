// src/pages/EventCreationPage.jsx
import React, { useState } from 'react';
import { database, storage } from '../firebase';
import { ref, push } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import styles from '../styles/eventcreationpage.css'; 

const EventCreationPage = () => {
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert('Please upload an event image');
      return;
    }

    setUploading(true);
    try {
      const imageStorageRef = storageRef(storage, `event_images/${imageFile.name}`);
      await uploadBytes(imageStorageRef, imageFile);
      const imageUrl = await getDownloadURL(imageStorageRef);

      const eventsRef = ref(database, 'events');
      await push(eventsRef, { ...eventData, imageUrl });
      alert('Event created successfully');
      setEventData({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        category: '',
        imageUrl: '',
      });
      setImageFile(null);
    } catch (error) {
      alert('Failed to create event: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <input
        type="text"
        name="title"
        placeholder="Event Title"
        value={eventData.title}
        onChange={handleChange}
        className={styles.inputField}
        required
      />
      <input
        type="date"
        name="date"
        placeholder="Event Date"
        value={eventData.date}
        onChange={handleChange}
        className={styles.inputField}
        required
      />
      <input
        type="time"
        name="time"
        placeholder="Event Time"
        value={eventData.time}
        onChange={handleChange}
        className={styles.inputField}
        required
      />
      <input
        type="text"
        name="location"
        placeholder="Event Location"
        value={eventData.location}
        onChange={handleChange}
        className={styles.inputField}
        required
      />
      <textarea
        name="description"
        placeholder="Event Description"
        value={eventData.description}
        onChange={handleChange}
        className={styles.textareaField}
        required
      ></textarea>
      <select
        name="category"
        value={eventData.category}
        onChange={handleChange}
        className={styles.selectField}
        required
      >
        <option value="">Select Category</option>
        <option value="workshop">Workshop</option>
        <option value="conference">Conference</option>
        <option value="concert">Concert</option>
      </select>
      
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className={styles.fileInput}
        required
      />
      <button type="submit" className={styles.submitButton} disabled={uploading}>
        {uploading && <span className={styles.uploadingSpinner}></span>}
        {uploading ? 'Uploading...' : 'Create Event'}
      </button>
    </form>
  );
};

export default EventCreationPage;
