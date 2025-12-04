import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import CreateEventModal from "./CreateEventModal";
import EventCard from "./EventCard";
import EventDetailsModal from "./EventDetailsModal";

const API_URL = process.env.REACT_APP_API_URL;

function Dashboard({ logout }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filters, setFilters] = useState({
    role: "all",
    q: "",
    date: "",
  });
  const { user, token } = useContext(AuthContext);

  const loadEvents = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.role !== "all") params.append("role", filters.role);
      if (filters.q) params.append("q", filters.q);
      if (filters.date) params.append("date", filters.date);

      const response = await axios.get(
        `${API_URL}/events?${params.toString()}`
      );
      if (response.data.success) {
        setEvents(response.data.data.events);
      }
    } catch (err) {
      console.error("Failed to load events:", err);
    } finally {
      setLoading(false);
    }
  }, [filters, token]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleEventClick = async (event) => {
    try {
      const response = await axios.get(`${API_URL}/events/${event._id}`);
      if (response.data.success) {
        setSelectedEvent(response.data.data);
      }
    } catch (err) {
      alert(err.response?.data?.error || "Failed to load event details");
    }
  };

  const handleEventDeleted = (eventId) => {
    setEvents(events.filter((e) => e._id !== eventId));
  };

  const getUserRole = (event) => {
    if (event.organizer?._id === user?.id || event.organizer === user?.id) {
      return "organizer";
    }

    const invitee = event.invitees?.find(
      (a) => a.user?._id === user?.id || a.user === user?.id
    );

    const attendee = event.attendees?.find(
      (a) => a.user?._id === user?.id || a.user === user?.id
    );

    const collaborator = event.collaborators?.find(
      (a) => a.user?._id === user?.id || a.user === user?.id
    );

    const collaboratorInvitee = event.collaboratorInvitees?.find(
      (a) => a.user?._id === user?.id || a.user === user?.id
    );

    if (collaborator) {
      return "collaborator";
    }
    if (collaboratorInvitee) {
      return "collaborator-invitee";
    }
    if (attendee) {
      return "attendee";
    }
    if (invitee) {
      return "invitee";
    }
    return "none";
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 style={{ margin: 0, color: "#333" }}>EventPlanner</h1>
          <p style={{ margin: "5px 0 0 0", color: "#666" }}>
            Welcome, {user?.name || user?.email}
          </p>
        </div>
        <button onClick={logout} className="btn-logout">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="filters-container">
          <input
            type="text"
            placeholder="Search events..."
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            className="form-input"
          />
          <select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            className="form-input"
          >
            <option value="all">All Roles</option>
            <option value="organizer">Organizing</option>
            <option value="attendee">Attending</option>
            <option value="invitee">Invited</option>
            <option value="collaborator">Collaborating</option>
            <option value="collaborator-invitee">Collaborator Invitee</option>
          </select>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            placeholder="Date"
            className="form-input"
          />
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-create-event"
        >
          + Create New Event
        </button>

        {loading ? (
          <p style={{ textAlign: "center", color: "#666" }}>
            Loading events...
          </p>
        ) : events.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666" }}>
            No events found. Create your first event!
          </p>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onEventClick={handleEventClick}
                onDelete={handleEventDeleted}
                userRole={getUserRole(event)}
              />
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onEventCreated={loadEvents}
        />
      )}

      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onUpdate={() => {
            loadEvents();
            setSelectedEvent(null);
          }}
          isOrganizer={getUserRole(selectedEvent) === "organizer"}
          userRole={getUserRole(selectedEvent)}
        />
      )}
    </div>
  );
}

export default Dashboard;
