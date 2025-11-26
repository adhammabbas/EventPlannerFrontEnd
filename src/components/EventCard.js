import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

function EventCard({ event, onEventClick, onDelete, userRole }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    setDeleting(true);
    try {
      await axios.delete(`${API_URL}/events/${event._id}`);
      onDelete(event._id);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete event');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Role badge text
  const roleText =
    userRole === 'organizer'
      ? 'Organizer'
      : userRole === 'collaborator'
      ? 'Collaborator'
      : userRole === 'collaborator-invitee'
      ? 'Collaborator Invitee'
      : userRole === 'attendee'
      ? 'Attendee'
      : userRole === 'invitee'
      ? 'Invitee'
      : '';

  return (
    <div className="event-card" onClick={() => onEventClick(event)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{event.title}</h3>
        {roleText && <span className={`role-badge ${userRole}`}>{roleText}</span>}
      </div>
      {event.description && (
        <p style={{ color: '#666', margin: '10px 0', fontSize: '14px' }}>
          {event.description.length > 100 ? event.description.substring(0, 100) + '...' : event.description}
        </p>
      )}
      <p style={{ color: '#888', fontSize: '13px', margin: '5px 0' }}>
        📅 {formatDate(event.date)}
      </p>
      {event.location && (
        <p style={{ color: '#888', fontSize: '13px', margin: '5px 0' }}>
          📍 {event.location}
        </p>
      )}
      {userRole === 'organizer' && (
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="btn-delete"
        >
          {deleting ? 'Deleting...' : 'Delete Event'}
        </button>
      )}
    </div>
  );
}

export default EventCard;
