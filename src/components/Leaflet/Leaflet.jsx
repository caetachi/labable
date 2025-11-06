import "./leaflet.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useState } from "react";

export default function Leaflet(props){
    //TODO:
    //gawing red yung marker, red nakalagay sa text eh hahahahhah

    delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
        iconRetinaUrl: markerIcon2x,
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
    });

    const [position, setPosition] = useState(props.coordinates); // Initial marker position

    const handleDragEnd = (event) => {
        const marker = event.target;
        const newPosition = marker.getLatLng(); // Get the new position
        setPosition([newPosition.lat, newPosition.lng]); // Update state
        console.log("New position:", newPosition);
    };
    
    return(
        <MapContainer center={position} zoom={10} scrollWheelZoom={false} style={{ height: "400px", width: "100%" }}>
            <TileLayer
                attribution='&copy; <a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url={`https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token=${import.meta.env.VITE_JAWGIO_API}`}
            />
            <Marker 
                position={position}
                draggable={true} // Enable dragging
                eventHandlers={{
                dragend: handleDragEnd, // Handle drag end event
                }}
            >
                <Tooltip>
                    {props.location_name}
                </Tooltip>
            </Marker>
        </MapContainer>
    )    
}