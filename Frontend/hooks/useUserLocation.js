import { useEffect, useState } from "react";

const useUserLocation = () => {
  const [location, setLocation] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user_location");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "user_location") {
        setLocation(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener("storage", onStorage);

    // Optional: Listen for custom event in same tab
    const onCustom = () => {
      const stored = localStorage.getItem("user_location");
      setLocation(stored ? JSON.parse(stored) : null);
    };
    window.addEventListener("user_location_updated", onCustom);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("user_location_updated", onCustom);
    };
  }, []);

  return location;
};

export default useUserLocation;