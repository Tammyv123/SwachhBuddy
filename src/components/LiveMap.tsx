import { useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: '100%',
  height: '400px'
};

const LiveMap = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyA2d3raCOccy5wtVfs60V-h7yJL6JviN90" // replace with your free dev key
  });

  const [position, setPosition] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        console.error(err);
      },
      { enableHighAccuracy: true, maximumAge: 1000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  if (!isLoaded) return <p>Loading map...</p>;
  if (!position) return <p>Fetching location...</p>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={position} zoom={16}>
      <Marker position={position} />
    </GoogleMap>
  );
};

export default LiveMap;
