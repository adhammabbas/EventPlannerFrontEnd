import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

function EventDetailsModal({
  event,
  onClose,
  onUpdate,
  isOrganizer,
  userRole,
}) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [responding, setResponding] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [collabEmail, setCollabEmail] = useState("");
  const [invitingCollab, setInvitingCollab] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [loadingCollaborators, setLoadingCollaborators] = useState(false);

  const loadAttendees = useCallback(async () => {
    setLoadingAttendees(true);
    try {
      const response = await axios.get(
        `${API_URL}/events/${event._id}/attendees`
      );
      if (response.data.success) {
        setAttendees(response.data.data);
      }
    } catch (err) {
      console.error("Failed to load attendees:", err);
    } finally {
      setLoadingAttendees(false);
    }
  }, [event._id]);

  const loadCollaborators = useCallback(async () => {
    setLoadingCollaborators(true);
    try {
      const response = await axios.get(
        `${API_URL}/events/${event._id}/collaborators`
      );
      if (response.data.success) setCollaborators(response.data.data);
    } catch (err) {
      console.error("Failed to load collaborators:", err);
    } finally {
      setLoadingCollaborators(false);
    }
  }, [event._id]);

  useEffect(() => {
    if (isOrganizer) {
      loadAttendees();
      loadCollaborators();
    }
  }, [isOrganizer, loadAttendees, loadCollaborators]);

  const handleInviteAttendee = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;

    setInviting(true);
    try {
      const response = await axios.post(
        `${API_URL}/events/${event._id}/invite/attendee`,
        {
          emails: [inviteEmail],
        }
      );
      if (response.data.success) {
        alert("Invitation sent!");
        setInviteEmail("");
        loadAttendees();
        onUpdate();
      }
    } catch (err) {
      alert(err.response?.data?.error || "Failed to send invitation");
    } finally {
      setInviting(false);
    }
  };

  const handleInviteCollaborator = async (e) => {
    e.preventDefault();
    if (!collabEmail) return;

    setInvitingCollab(true);
    try {
      const response = await axios.post(
        `${API_URL}/events/${event._id}/invite/collaborator`,
        {
          emails: [collabEmail],
        }
      );
      if (response.data.success) {
        alert("Collaborator invited!");
        setCollabEmail("");
        loadCollaborators();
        onUpdate();
      }
    } catch (err) {
      alert(err.response?.data?.error || "Failed to invite collaborator");
    } finally {
      setInvitingCollab(false);
    }
  };

  const handleRespondAttendee = async (status) => {
    setResponding(true);
    try {
      const response = await axios.put(
        `${API_URL}/events/${event._id}/respond/attendee`,
        { status }
      );
      if (response.data.success) {
        alert("Response recorded!");
        onUpdate();
      }
    } catch (err) {
      alert(err.response?.data?.error || "Failed to record response");
    } finally {
      setResponding(false);
    }
  };

  const handleRespondCollaborator = async (status) => {
    setResponding(true);
    try {
      const response = await axios.put(
        `${API_URL}/events/${event._id}/respond/collaborator`,
        { status }
      );
      if (response.data.success) {
        alert("Response recorded!");
        onUpdate();
      }
    } catch (err) {
      alert(err.response?.data?.error || "Failed to record response");
    } finally {
      setResponding(false);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="modal-overlay">
      <div className="modal-content event-details">
        {/* Event Info */}
        <h2 style={{ marginBottom: "10px" }}>{event.title}</h2>
        <p style={{ color: "#666" }}>{event.description || "No description"}</p>
        <p style={{ color: "#888", fontSize: "14px" }}>
          📅 {formatDate(event.date)}
        </p>
        {event.location && (
          <p style={{ color: "#888", fontSize: "14px" }}>📍 {event.location}</p>
        )}
        {event.organizer && (
          <p style={{ color: "#888", fontSize: "14px" }}>
            👤 Organized by: {event.organizer.name || event.organizer.email}
          </p>
        )}

        {/* Organizer Section */}
        {isOrganizer && (
          <>
            <div style={{ marginTop: "15px" }}>
              <h3>Invite Attendees</h3>
              <form
                onSubmit={handleInviteAttendee}
                style={{ display: "flex", gap: "10px" }}
              >
                <input
                  type="email"
                  placeholder="Enter email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  style={{ flex: 1 }}
                  className="form-input"
                />
                <button
                  type="submit"
                  disabled={inviting}
                  className="btn-primary"
                >
                  {inviting ? "Sending..." : "Invite"}
                </button>
              </form>
            </div>

            <div style={{ marginTop: "20px" }}>
              <h3>Attendees</h3>
              {loadingAttendees ? (
                <p>Loading attendees...</p>
              ) : attendees.length > 0 ? (
                <div>
                  {attendees.map((att, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "5px",
                      }}
                    >
                      <span>
                        {att.user?.name || att.user?.email || att.email}
                      </span>
                      <span
                        className={`status-badge ${att.status
                          ?.toLowerCase()
                          ?.replace(" ", "-")}`}
                      >
                        {att.status || "Pending"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No attendees yet</p>
              )}
            </div>
            <div style={{ marginTop: "25px" }}>
              <h3>Invite Collaborators</h3>

              {/* Invite collaborators */}
              <form
                onSubmit={handleInviteCollaborator}
                style={{ display: "flex", gap: "10px" }}
              >
                <input
                  type="email"
                  placeholder="Enter collaborator's email"
                  value={collabEmail}
                  onChange={(e) => setCollabEmail(e.target.value)}
                  className="form-input"
                  style={{ flex: 1 }}
                />
                <button
                  type="submit"
                  disabled={invitingCollab}
                  className="btn-primary"
                >
                  {invitingCollab ? "Sending..." : "Invite"}
                </button>
              </form>

              {/* List collaborators */}
              <div style={{ marginTop: "12px" }}>
                <h3>Collaborators</h3>
                {loadingCollaborators ? (
                  <p>Loading collaborators...</p>
                ) : collaborators.length > 0 ? (
                  collaborators.map((c, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 5,
                      }}
                    >
                      <span>{c.user?.name || c.user?.email || c.email}</span>
                      <span className="status-badge going">
                        Yes
                      </span>
                    </div>
                  ))
                ) : (
                  <p>No collaborators yet</p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Attendee / Invitee Section */}
        {!isOrganizer && (userRole === "invitee" || userRole ==="attendee") && (
          <div style={{ marginTop: "20px" }}>
            <h3>Your Response</h3>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => handleRespondAttendee("Going")}
                disabled={responding}
                className="btn-going"
              >
                Going
              </button>
              <button
                onClick={() => handleRespondAttendee("Maybe")}
                disabled={responding}
                className="btn-maybe"
              >
                Maybe
              </button>
              <button
                onClick={() => handleRespondAttendee("Not Going")}
                disabled={responding}
                className="btn-not-going"
              >
                Not Going
              </button>
            </div>
            {userRole === "invitee" && (
              <p style={{ color: "#888", marginTop: "5px" }}>
                You are invited. Please respond!
              </p>
            )}
          </div>
        )}

        {/* Collaborator Response Section */}
        {!isOrganizer && (userRole === "collaborator" || userRole === "collaborator-invitee") && (
          <div style={{ marginTop: "20px" }}>
            <h3>Your Response</h3>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => handleRespondCollaborator("Yes")}
                disabled={responding}
                className="btn-going"
                style={{ backgroundColor: "green", color: "white" }}
              >
                Yes
              </button>
              <button
                onClick={() => handleRespondCollaborator("No")}
                disabled={responding}
                className="btn-not-going"
                style={{ backgroundColor: "red", color: "white" }}
              >
                No
              </button>
            </div>
            <p style={{ color: "#888", marginTop: "5px" }}>
              You have been invited to collaborate on this event.
            </p>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn-secondary"
          style={{ marginTop: "20px", width: "100%" }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default EventDetailsModal;
