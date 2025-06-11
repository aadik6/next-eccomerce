import React, { useEffect, useState } from "react";

const LocationTracker = () => {
  const [location, setLocation] = useState(() => {
    // Load from localStorage on mount
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user_location");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const detectLocation = async () => {
    setLoading(true);
    setError(null);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          {
            location ? (
              <div>
                <div>Latitude: {location.lat}</div>
                <div>Longitude: {location.lon}</div>
                <div>Name: {location.name}</div>
              </div>
            ) : (
              <div>No location detected yet.</div>
            );
          }
          const corsProxy = "https://corsproxy.io/?";
          const url = `${corsProxy}https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
          const res = await fetch(url);
          const data = await res.json();
          const loc = {
            name: data.display_name,
            lat: latitude,
            lon: longitude,
          };
          setLocation(loc);
          localStorage.setItem("user_location", JSON.stringify(loc));
          window.dispatchEvent(new Event("user_location_updated"));
        } catch (err) {
          setError("Failed to fetch location name: " + err.message);
        }
        setLoading(false);
      },
      (err) => {
        setError("Permission denied or unavailable.");
        setLoading(false);
      }
    );
  };

  const clearLocation = () => {
    setLocation(null);
    localStorage.removeItem("user_location");
  };

  const getLocation = async () => {
    await detectLocation();
  };

  useEffect(() => {
    getLocation();
  }, []);
  return (
    <div>
      <a
        className="btn btn-primary"
        data-bs-toggle="offcanvas"
        href="#locationTracker"
        role="button"
        aria-controls="locationTracker"
      >
        {location ? `Location: ${location.name}` : "Track Location"}
      </a>

      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="locationTracker"
        aria-labelledby="locationTrackerLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="locationTrackerLabel">
            Location Tracker
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          {location ? (
            <div>
              <p>
                <strong>Your current location:</strong>
                <br />
                {location.name}
                <br />
                <span className="text-muted small">
                  (Lat: {location.lat}, Lon: {location.lon})
                </span>
              </p>
              <button className="btn btn-secondary" onClick={clearLocation}>
                Clear Location
              </button>
            </div>
          ) : (
            <div>
              {loading && <p>Detecting your location...</p>}
              {error && <p className="text-danger">{error}</p>}
              {!loading && !error && (
                <button className="btn btn-primary" onClick={detectLocation}>
                  Detect Location
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationTracker;
