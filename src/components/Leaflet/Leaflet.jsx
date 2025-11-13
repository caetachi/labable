import "./leaflet.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const defaultCoords = [14.5995, 120.9842]; 

export default function Leaflet(props) {

  const [position, setPosition] = useState(null);
  const [locationName, setLocationName] = useState(props.location_name || "");

  useEffect(() => {
    async function fetchInitialCoordinates() {
      try {
 
        if (props.coordinates && props.coordinates.length === 2) {
          setPosition(props.coordinates);
        
        } else if (props.location_name) {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(props.location_name)}`
          );
          const data = await response.json();
          if (data && data.length > 0) {
            const { lat, lon } = data[0];
            const newCoords = [parseFloat(lat), parseFloat(lon)];
            setPosition(newCoords);
            props.onCoordinateChange && props.onCoordinateChange(newCoords);
          } else {
            setPosition(defaultCoords);
          }
        
        } else {
          setPosition(defaultCoords);
        }
      } catch (error) {
        console.error("Error fetching initial coordinates:", error);
        setPosition(defaultCoords); 
      }
    }

    fetchInitialCoordinates();
    
  }, [props]);

  const handleSearch = async () => {
    if (locationName) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          const newCoords = [parseFloat(lat), parseFloat(lon)];
          setPosition(newCoords);
          props.onCoordinateChange && props.onCoordinateChange(newCoords);
          toast.success("Location found and marker updated!");
        } else {
          console.warn("No coordinates found for", locationName);
          toast.error("Location not found.");
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
        toast.error("Error fetching location data.");
      }
    }
  };

  const handleDragEnd = async (event) => {
    const marker = event.target;
    const newPosition = marker.getLatLng();
    const coords = [newPosition.lat, newPosition.lng];

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${newPosition.lat}&lon=${newPosition.lng}`
      );
      const data = await response.json();
      const newName = data.display_name || "Unknown location";

      setLocationName(newName);
      setPosition(coords);
      props.onCoordinateChange && props.onCoordinateChange(coords);
      props.onLocationNameChange && props.onLocationNameChange(newName);
    } catch (error) {
      console.error("Error during reverse geocoding:", error);
      
      setPosition(coords);
      props.onCoordinateChange && props.onCoordinateChange(coords);
    }
  };

  if (!position) {
    return <p>Loading map...</p>;
  }

  return (
    <div className="leaflet-container">
      <div className="field-group">
        <label>Location Name</label>
        <div className="input-search">
            <input
            type="text"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button type="button" onClick={handleSearch}>
            Search
            </button>
        </div>
      </div>

      <p>Latitude: {position[0]}</p>
      <p>Longitude: {position[1]}</p>

      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "400px", width: "100%" }}

        key={position.join(",")}
      >
        <TileLayer
          attribution='&copy; <a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={`https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token=${import.meta.env.VITE_JAWGIO_API}`}
        />
        <Marker position={position} draggable={true} eventHandlers={{ dragend: handleDragEnd }}>
          <Tooltip>{locationName}</Tooltip>
        </Marker>
      </MapContainer>
    </div>
  );
}