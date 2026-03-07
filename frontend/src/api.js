import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json"
  }
});

/* -------------------------
   EVENT APIs
--------------------------*/

// Get upcoming events
export const getUpcomingEvents = () => {
  return api.get("/events/public/upcoming");
};

// Get gallery events
export const getGalleryEvents = () => {
  return api.get("/events/public/gallery");
};

// Get pending events (Dean approval)
export const getPendingEvents = () => {
  return api.get("/events/pending");
};

// Get events created by a user
export const getMyCreatedEvents = (userId) => {
  return api.get(`/events/my-created?userId=${userId}`);
};

// Get events a student applied to
export const getMyApplications = (registrationNo) => {
  return api.get(`/events/my-applications?registrationNo=${registrationNo}`);
};

export default api;